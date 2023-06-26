// import express from 'express';
// import multer from 'multer';
// import { v2 as cloudinary } from 'cloudinary';
// import streamifier from 'streamifier';
// import { isAdmin, isAuth } from '../utils.js';
const express = require('express');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const {isAdmin,isAuth} = require('../util.js');
const multer = require('multer');
const upload = multer();

const uploadRouter = express.Router();

uploadRouter.post(
  '/',
  isAuth,
  isAdmin,
  upload.single('file'),
  async (req, res) => {
    cloudinary.config({
      cloud_name: `kick-pik`,
      api_key: `771394366945955`,
      api_secret: `YFi6yLD2SNC6k5MAK3wCu6IgtKU`,
    });
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    const result = await streamUpload(req);
    res.send(result);
  }
);
module.exports =uploadRouter;