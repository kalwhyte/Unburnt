import Instabug, { InvocationEvent } from 'instabug-reactnative';

export const initInstabug = () => {
  Instabug.init({
    token: 'YOUR_INSTABUG_TOKEN',
    invocationEvents: [InvocationEvent.shake, InvocationEvent.screenshot],
  });
};

export const showFeedbackForm = () => {
  Instabug.show();
};
