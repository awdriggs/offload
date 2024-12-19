import fetch from 'node-fetch';
import fs from 'fs';
import FormData from 'form-data';

import { trimModelName } from '../utils/agentUtils.js';

const uploadFileToReplicate = async (filePath, originalName) => {
  // Prepare the form data
  const formData = new FormData();

  formData.append("content", fs.createReadStream(filePath), {
    contentType: "application/zip",
    filename: originalName,
  });

  //console.log("form", formData);

  // Step 2: Upload the file to Replicate's files API
  const fileResponse = await fetch('https://api.replicate.com/v1/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
      ...formData.getHeaders(), // Get appropriate headers for multipart/form-data
    },
    body: formData,
  });

  const fileResult = await fileResponse.json();

  if (!fileResponse.ok) {
    //console.log(fileResult);
    throw new Error(`File upload failed: ${JSON.stringify(fileResult)}`);
  }

  return fileResult.urls.get
};

const initiateTraining = async (modelName, trigger, fileUrl) => {
  const url =
    'https://api.replicate.com/v1/models/ostris/flux-dev-lora-trainer/versions/d995297071a44dcb72244e6c19462111649ec86a9646c32df56daa7f14801944/trainings';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        destination: `${process.env.REPLICATE_OWNER}/${modelName}`,
        input: {
          input_images: fileUrl,
          trigger_word: trigger,
        },
        // webhook: `${process.env.SITE_URL}/webhook/training-status` //not using, returns a huge payload
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`Training failed: ${result.message || JSON.stringify(result)}`);
    }

    return result;
  } catch (error) {
    throw new Error(`Error in trainModel: ${error.message}`);
  }
}

const createModel = async (name, description, uName) => {
  const url = 'https://api.replicate.com/v1/models';
  const modelName = trimModelName(name);
  let modelData = {"owner": process.env.REPLICATE_OWNER, "name": uName + "_" + modelName, "description": description, "visibility": "private", "hardware": "gpu-t4"}

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(modelData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(`Failed to create model: ${result.message || JSON.stringify(result)}`);
    }
    console.log(result);
    return {name: result.name, owner: result.owner, url: result.url, weights: result.weights_url};
  } catch (error) {
    throw new Error(`Error in createModelOnReplicate: ${error.message}`);
  }
}

const getModel = async (name) => {
  // const url = `https://api.replicate.com/v1/models/${model}`;
  //the url is passed form the controller
  console.log("getting model");
  let url = `https://api.replicate.com/v1/models/${process.env.REPLICATE_OWNER}/${name}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        // 'Content-Type': 'application/json', //not needed for a get?
      },
    });

    if (!response.ok) {
      // console.log(response.statusText);
      throw new Error(`Failed to fetch model details: ${response.statusText}`);
    }

    const modelDetails = await response.json();
    return modelDetails;
  } catch (error) {
    throw new Error(`Error in getModelDetails: ${error.message}`);
  }
};





export { uploadFileToReplicate, initiateTraining, createModel, getModel};
