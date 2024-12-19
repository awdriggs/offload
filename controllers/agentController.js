import Agent from '../models/Agent.js';
import User from '../models/User.js';

import { getUsernameById } from '../utils/dbUtils.js';

//for the upload
import multer from 'multer';
import fs from 'fs';

//import the needed services
import { createModel, uploadFileToReplicate, initiateTraining, getModel } from '../services/agentService.js';

//still needed in this file?
import fetch from 'node-fetch';
import FormData from 'form-data';
import path from 'path';

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' }).single('data');

// Get all agents for a user
export const getUserAgents = async (req, res) => {
  const userId = req.user.id; // Assuming you use a middleware to add user info from the JWT

  try {
    const agents = await Agent.find({ user: userId });
    
    //try to get the status here?

    res.status(200).json({ agents });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete an agent
export const deleteAgent = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const agent = await Agent.findOneAndDelete({ _id: id, user: userId });

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.status(200).json({ message: 'Agent deleted', agent });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// get an agent
export const getAgent = async (req, res) => {
  console.log("getting a single agent");
  const { id } = req.params;
  const userId = req.user.id;

  try {

    // console.log(id);
    // const agent = await Agent.findOne({ _id: id, user: userId });

    // if (!agent) {
    //   return res.status(404).json({ message: 'Agent not found' });
    // }

    const agent = await Agent.findById(id).populate('user', 'username'); // Optionally populate user info
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    //this is kind of a hack because the webhook for a completed training was huge
    //when you get an agent, get the model details from replicate
    //if the model is trained, it should have a weights field
    //if there is weights, update this agent to have the status of 'trained'
    console.log(agent); 
    const model = await getModel(agent.modelName);
    console.log(model);

    res.status(200).json({ message: 'Agent found', agent });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};  

// Train an agent
export const trainAgent = async (req, res) => {
  upload(req, res, async (err) => {

    if (err) {
      return res.status(400).json({ message: 'File upload failed', error: err.message });
    }

    const userId = req.user.id; // Assuming you use a middleware to add user info from the JWT
    // const userName = getUsernameById(userId);

    const { name, description } = req.body;
    const filePath = req.file.path;
    const originalName = req.file.originalname;

    const userName = await getUsernameById(userId);
    // console.log(userName);

    try {

      // use the userName in the name of the model
      const model = await createModel(name, description, userName);

      // create a Agent in the db with the model id
      // pass the name and descption to the db
      console.log("model.name", model.name);
      // console
      const newAgent = await Agent.create({ user: userId, modelName: model.name, modelDesc: description, url: model.url, weights: model.weights });

      console.log(newAgent);

      //newAgent.trigger //trigger word from model

//TODO uncomment this to begin training
      // Upload file to Replicate
      const fileUrl = await uploadFileToReplicate(filePath, originalName);

      // Initiate the Training
      const trainingResult = await initiateTraining(model.name, newAgent.trigger, fileUrl);
      //username should be replicate username, not offload username
      // "destination": "your-username/your-model-name",

      // Cleanup: Remove uploaded file
      fs.unlink(filePath, () => {});

      res.status(200).json({
        //TODO decide what the response should be
        // message: 'Testing Model creation',
        model: model,

        // id: userId,
        message: 'Training started successfully',
        // message: 'file uploaded successfully',
        // url: fileUrl,
        // training: trainingResult,
        id: trainingResult.id,
        // status: trainingResult.status,
      });

    } catch (error) {
      // Cleanup in case of an error
      fs.unlink(filePath, () => {});

      console.log(error.message);

      res.status(500).json({
        message: 'Server error',
        error: error.message,
      });
    }
  });
};
