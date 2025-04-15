const express = require('express');
const router = express.Router();
const handleDropboxWebhook = require('../handleWebhook');

// GET route for Dropbox webhook verification
router.get('/', (req, res) => {
  const challenge = req.query.challenge;
  if (challenge) {
    res.send(challenge);
  } else {
    res.status(400).send('Missing challenge');
  }
});

// POST route to handle Dropbox webhook events
router.post('/', async (req, res) => {
  console.log('📡 Webhook POST received!');
  console.log('Body:', req.body);

  const { list_folder } = req.body;
  if (list_folder && list_folder.accounts && list_folder.accounts.length > 0) {
    for (const accountId of list_folder.accounts) {
      await handleDropboxWebhook(accountId);
    }
  }

  res.sendStatus(200);
});

module.exports = router;
