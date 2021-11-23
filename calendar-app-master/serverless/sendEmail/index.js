/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an orchestrator function.
 *
 * Before running this sample, please:
 * - create a Durable orchestration function
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your
 *   function app in Kudu
 */

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env['SENDGRID_API_KEY']);
module.exports = async function(context) {
  const { email, title, startAt, description } = context.bindings.payload;
  const msg = {
    to: email,
    from: { email: 'chris@codebeast.dev', name: 'Codebeast Calendar' },
    subject: `Event: ${title}`,
    html: `<h4>${title} @ ${startAt}</h4> <p>${description}</p>`
  };
  sgMail.send(msg);

  return msg;
};
