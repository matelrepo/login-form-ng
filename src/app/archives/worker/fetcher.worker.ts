/// <reference lib="webworker" />

addEventListener('message',  messageEvent  => {
  handler((messageEvent as MessageEvent).data);

});

function handler({freq}) {
  const response = `worker response to ${freq}`;
  postMessage(response);
}
