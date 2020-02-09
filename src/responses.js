const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);

const messages = {
  success: 'This is a successful response',
  badRequest: 'Missing valid query parameter set to true',
  badRequestValid: 'This request has the required parameters',
  unauthorized: 'Missing loggedIn query parameter set to yes',
  unauthorizedYes: 'You have successfully viewed the content',
  forbidden: 'You do not have access to this content.',
  internal: 'Internal Server Error. Something went wrong.',
  notImplemented: 'A get request for this page has not been implemented yet.',
  notFound: 'The page you are looking for was not found.',
};

const makeXML = (data, showID) => {
  let xmlString = '<response>';
  xmlString = `${xmlString}<message>${data}</message>`;
  if (showID) xmlString = `${xmlString}<id>${showID}</id>`;
  xmlString = `${xmlString}</response>`;

  return xmlString;
};

const makeJSONString = (data, showID) => {
  let obj;

  if (showID) {
    obj = {
      id: showID,
      message: data,
    };
  } else {
    obj = {
      message: data,
    };
  }

  return JSON.stringify(obj);
};

const respond = (request, response, statusCode, content, contentType) => {
  response.writeHead(statusCode, { 'Content-Type': contentType });
  response.write(content);
  response.end();
};

const getIndex = (request, response) => {
  respond(request, response, 200, index, 'text/html');
};

const getStyle = (request, response) => {
  respond(request, response, 200, style, 'text/css');
};

const getSuccess = (request, response, acceptedTypes) => {
  if (acceptedTypes[0] === 'text/xml') return respond(request, response, 200, makeXML(messages.success), 'text/xml');
  return respond(request, response, 200, makeJSONString(messages.success), 'application/json');
};

const getForbidden = (request, response, acceptedTypes) => {
  if (acceptedTypes[0] === 'text/xml') return respond(request, response, 403, makeXML(messages.forbidden, 'forbidden'), 'text/xml');
  return respond(request, response, 403, makeJSONString(messages.forbidden, 'forbidden'), 'application/json');
};

const getInternal = (request, response, acceptedTypes) => {
  if (acceptedTypes[0] === 'text/xml') return respond(request, response, 500, makeXML(messages.internal, 'internalError'), 'text/xml');
  return respond(request, response, 500, makeJSONString(messages.internal, 'internalError'), 'application/json');
};

const getNotImplemented = (request, response, acceptedTypes) => {
  if (acceptedTypes[0] === 'text/xml') return respond(request, response, 501, makeXML(messages.notImplemented, 'notImplemented'), 'text/xml');
  return respond(request, response, 501, makeJSONString(messages.notImplemented, 'notImplemented'), 'application/json');
};

const getNotFound = (request, response, acceptedTypes) => {
  if (acceptedTypes[0] === 'text/xml') return respond(request, response, 404, makeXML(messages.notFound, 'notFound'), 'text/xml');
  return respond(request, response, 404, makeJSONString(messages.notFound, 'notFound'), 'application/json');
};

const getBadRequest = (request, response, acceptedTypes, params) => {
  if (!params.valid || params.valid !== 'true') {
    if (acceptedTypes[0] === 'text/xml') return respond(request, response, 400, makeXML(messages.badRequest, 'badRequest'), 'text/xml');
    return respond(request, response, 400, makeJSONString(messages.badRequest, 'badRequest'), 'application/json');
  }

  if (acceptedTypes[0] === 'text/xml') return respond(request, response, 200, makeXML(messages.badRequestValid), 'text/xml');
  return respond(request, response, 200, makeJSONString(messages.badRequestValid), 'application/json');
};

const getUnauthorized = (request, response, acceptedTypes, params) => {
  if (!params.loggedIn || params.loggedIn !== 'yes') {
    if (acceptedTypes[0] === 'text/xml') return respond(request, response, 401, makeXML(messages.unauthorized, 'unauthorized'), 'text/xml');
    return respond(request, response, 401, makeJSONString(messages.unauthorized, 'unauthorized'), 'application/json');
  }

  if (acceptedTypes[0] === 'text/xml') return respond(request, response, 200, makeXML(messages.unauthorizedYes), 'text/xml');
  return respond(request, response, 200, makeJSONString(messages.unauthorizedYes), 'application/json');
};

module.exports = {
  getIndex,
  getStyle,
  getSuccess,
  getBadRequest,
  getUnauthorized,
  getForbidden,
  getInternal,
  getNotImplemented,
  getNotFound,
};
