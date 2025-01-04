import { io } from "socket.io-client";

const socket = io("http://localhost:5000");  

export const listenForDocumentUpdates = (callback) => {
  socket.on("document_updated", callback);
};

export const listenForDocumentLoad = (callback) => {
  socket.on("load_document", callback);
};

export const listenForStatus = (callback) => {
  socket.on("status", callback);
};

export const listenForErrors = (callback) => {
  socket.on("error", callback);
};

export const joinDocumentRoom = (docId, userId) => {
  socket.emit("join_document", { document_id: docId, user_id: userId });
};

export const sendDocumentEdit = (docId, content, revisionNumber, userId) => {
  socket.emit("edit_document", {
    document_id: docId,
    content: content,
    revision_number: revisionNumber,
    user_id: userId
  });
};

export const getDocumentVersion = (docId, revisionNumber) => {
  socket.emit("get_document_version", {
    document_id: docId,
    revision_number: revisionNumber
  });
};

export const disconnectSocket = () => {
  socket.disconnect();
};

export default socket;
