"use strict";

require("dotenv").config();

// Access token for your app
// (copy token from DevX getting started page
// and save it as environment variable into the .env file)
const token = process.env.WHATSAPP_TOKEN;

// Imports dependencies and set up http server
const express = require("express");
const body_parser = require("body-parser");
const { UserModel } = require("./model/user-model");
const { connection } = require("./configs/db");
const axios = require("axios").default;
const app = express()
app.use(body_parser.json()); // creates express http server
app.use("/static", express.static("public"))
const PORT = process.env.PORT || 1337;
const HOST_URL = process.env.HOST_URL;

// import Food from "./images/food-1.pdf";

const DadarAmbience = [
  "https://i.postimg.cc/Z5rTH3JD/2022-10-22.jpg",
  "https://i.postimg.cc/BZLtDjPR/2022-04-25.jpg",
  "https://i.postimg.cc/MpxGht38/2023-04-25.jpg",
  "https://i.postimg.cc/W3QNS7qC/2023-01-14.jpg",
  "https://i.postimg.cc/449Nyjrg/2023-02-24.jpg",
  "https://i.postimg.cc/gJ6dw6tD/2023-04-25-1.jpg"
];
const JuhuAmbience = [
  "https://i.postimg.cc/BnKWs1bc/2022-11-18.jpg",
  "https://i.postimg.cc/Qdk2HZgH/2023-06-15.jpg",
  "https://i.postimg.cc/VNf3tZ44/2023-06-15-1.jpg",
  "https://i.postimg.cc/HkQSB0jK/IMG20230101195508.jpg",
  "https://i.postimg.cc/br7TRdPp/IMG-20221031-205749.jpg",
  "https://i.postimg.cc/XNr6xhWz/IMG-20221031-210049.jpg"

];
const DadarTopDishes = [
  "https://i.postimg.cc/vZHsrKSD/2023-09-02.jpg",
  "https://i.postimg.cc/ZqWzgdmS/2022-02-22.jpg",
  "https://i.postimg.cc/Ss4V9BDv/PXL-20220525-154337712-PORTRAIT.jpg",
  "https://i.postimg.cc/gjnhL4F7/2020-12-29.jpg",
  "https://i.postimg.cc/0jFwYm9y/2022-06-24.jpg",
  "https://i.postimg.cc/fTSXwHvt/IMG-20180124-194446.jpg",
  "https://i.postimg.cc/bYBkfX1f/IMG-20181114-192911.jpg",
];
const JuhuTopDishes = [
  "https://i.postimg.cc/DfrHCKD5/2022-11-15.jpg",
  "https://i.postimg.cc/1Xrd4p6b/20221102-211159.jpg",
  "https://i.postimg.cc/d1dpcM0s/2023-03-05.jpg",
  "https://i.postimg.cc/kX7ZzpPC/2023-06-15.jpg",
  "https://i.postimg.cc/4NwMgQX9/IMG20230101203900.jpg"

];

// Sets server port and logs message on success
// app.listen(PORT, () => console.log(`webhook is listening at ${PORT}`));

app.get("/", (req, res) => res.send("Welcome"));

// Accepts POST requests at /webhook endpoint
app.post("/webhook", async (req, res) => {
  // Parse the request reqData from the POST
  try {
    let reqData = req.body;

    // Check the Incoming webhook message
    console.log(JSON.stringify(reqData, null, 2));

    // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
    if (reqData.object) {
      if (
        reqData.entry &&
        reqData.entry[0].changes &&
        reqData.entry[0].changes[0] &&
        reqData.entry[0].changes[0].value.messages &&
        reqData.entry[0].changes[0].value.messages[0]
      ) {
        const phone_number_id =
          reqData.entry[0].changes[0].value.metadata.phone_number_id;
        const from = reqData.entry[0].changes[0].value.messages[0].from;
        const name = reqData.entry[0].changes[0].value.contacts[0].profile.name;
        const ifExist = await UserModel.find({ recipient: from });
        if (ifExist.length === 0) {
          const newdata = new UserModel({
            name: name,
            recipient: from,
            phone_number_id: phone_number_id,
          });
          await newdata.save();
        }
        if (reqData.entry[0].changes[0].value.messages[0].type === "text") {
          let msg_body =
            reqData.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
          console.log(
            reqData.entry[0].changes[0].value.messages[0],
            "body.entry[0].changes[0].value.messages[0]"
          );
          if (
            msg_body == "Hi" ||
            msg_body == "hi" ||
            msg_body == "Hey" ||
            msg_body == "hey" ||
            msg_body == "Hello" ||
            msg_body == "hello"
          ) {
            msg_body =
              "Welcome to *Pritam* *Da* *Dhaba* . FROM HUMBLE BEGINNINGS IN 1942, WE'VE BECOME MUMBAI'S BELOVED CULINARY DESTINATION. https://www.pritamhotels.in/";
            welcomeMessageMenu(phone_number_id, msg_body, from);
          } else if (
            msg_body == "Ok" ||
            msg_body == "ok" ||
            msg_body == "thanks"
          ) {
            msg_body = "Thank you for contacting us";
            okresponse(phone_number_id, from, msg_body);
          } else {
            msg_body =
            "Welcome to *Pritam* *Da* *Dhaba* . FROM HUMBLE BEGINNINGS IN 1942, WE'VE BECOME MUMBAI'S BELOVED CULINARY DESTINATION. https://www.pritamhotels.in/";
            welcomeMessageMenu(phone_number_id, msg_body, from);
          }
        } else if (
          reqData.entry[0].changes[0].value.messages[0].type ===
            "interactive" &&
          reqData.entry[0].changes[0].value.messages[0].interactive &&
          reqData.entry[0].changes[0].value.messages[0].interactive.type ===
            "button_reply" &&
          reqData.entry[0].changes[0].value.messages[0].interactive
            .button_reply &&
          reqData.entry[0].changes[0].value.messages[0].interactive.button_reply
            .id
        ) {
          let msg_body =
            reqData.entry[0].changes[0].value.messages[0].interactive
              .button_reply.title; // extract the message text from the webhook payload
          console.log(
            reqData.entry[0].changes[0].value.messages[0].interactive
              .button_reply.title,
            "reqData.entry[0].changes[0].value.messages[0].interactive.button_reply.title"
          );

          if (
            reqData.entry[0].changes[0].value.messages[0].interactive
              .button_reply.id === "UNIQUE_BUTTON_ID_1"
          ) {
            buttonId1Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive
              .button_reply.id === "UNIQUE_BUTTON_ID_2"
          ) {
            buttonId2Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive
              .button_reply.id === "UNIQUE_BUTTON_ID_3"
          ) {
            buttonId3Response(phone_number_id, from, msg_body);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive
              .button_reply.id === "UNIQUE_BUTTON_ID_4"
          ) {
            buttonId4Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive
              .button_reply.id === "UNIQUE_BUTTON_ID_5"
          ) {
            buttonId5Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive
              .button_reply.id === "UNIQUE_BUTTON_ID_6"
          ) {
            buttonId6Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive
              .button_reply.id === "UNIQUE_BUTTON_ID_7"
          ) {
            buttonId7Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive
              .button_reply.id === "UNIQUE_BUTTON_ID_8"
          ) {
            buttonId8Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive
              .button_reply.id === "UNIQUE_BUTTON_ID_9"
          ) {
            buttonId9Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive
              .button_reply.id === "UNIQUE_BUTTON_ID_10"
          ) {
            buttonId10Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive
              .button_reply.id === "UNIQUE_BUTTON_ID_11"
          ) {
            buttonId11Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive
              .button_reply.id === "UNIQUE_BUTTON_ID_12"
          ) {
            buttonId12Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive
              .button_reply.id === "UNIQUE_BUTTON_ID_13"
          ) {
            buttonId13Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive
              .button_reply.id === "UNIQUE_BUTTON_ID_14"
          ) {
            buttonId14Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive
              .button_reply.id === "UNIQUE_BUTTON_ID_15"
          ) {
            buttonId15Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive
              .button_reply.id === "UNIQUE_BUTTON_ID_16"
          ) {
            buttonId16Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive
              .button_reply.id === "UNIQUE_BUTTON_ID_17"
          ) {
            buttonId17Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive
              .button_reply.id === "UNIQUE_BUTTON_ID_18"
          ) {
            buttonId18Response(phone_number_id, from);
          } else {
            noresponse(phone_number_id, from);
          }
          res.sendStatus(200);
        } else if (
          reqData.entry[0].changes[0].value.messages[0].type ===
            "interactive" &&
          reqData.entry[0].changes[0].value.messages[0].interactive &&
          reqData.entry[0].changes[0].value.messages[0].interactive.type ===
            "list_reply" &&
          reqData.entry[0].changes[0].value.messages[0].interactive
            .list_reply &&
          reqData.entry[0].changes[0].value.messages[0].interactive.list_reply
            .id
        ) {
          let msg_body =
            reqData.entry[0].changes[0].value.messages[0].interactive.list_reply
              .title; // extract the message text from the webhook payload
          console.log(
            reqData.entry[0].changes[0].value.messages[0].interactive.list_reply
              .title,
            "reqData.entry[0].changes[0].value.messages[0].interactive.list_reply.title"
          );

          if (
            reqData.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === "OUR_SERVICE_1_ID"
          ) {
            listId1Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === "OUR_SERVICE_2_ID"
          ) {
            listId2Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === "OUR_SERVICE_3_ID"
          ) {
            listId3Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === "OUR_SERVICE_4_ID"
          ) {
            listId4Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === "OUR_SERVICE_5_ID"
          ) {
            listId5Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === "OUR_SERVICE_6_ID"
          ) {
            listId6Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === "OUR_SERVICE_7_ID"
          ) {
            listId7Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === "OUR_SERVICE_8_ID"
          ) {
            listId8Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === "OUR_SERVICE_9_ID"
          ) {
            listId9Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === "OUR_SERVICE_10_ID"
          ) {
            listId10Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === "OUR_SERVICE_11_ID"
          ) {
            listId11Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === "OUR_SERVICE_12_ID"
          ) {
            listId12Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === "OUR_SERVICE_13_ID"
          ) {
            listId13Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === "OUR_SERVICE_14_ID"
          ) {
            listId14Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === "OUR_SERVICE_15_ID"
          ) {
            listId15Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === "OUR_SERVICE_16_ID"
          ) {
            listId16Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === "OUR_SERVICE_17_ID"
          ) {
            listId17Response(phone_number_id, from);
          } else if (
            reqData.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === "OUR_SERVICE_18_ID"
          ) {
            listId18Response(phone_number_id, from);
          } else {
            noresponse(phone_number_id, from);
          }
          res.sendStatus(200);
        }
      }
    } else {
      // Return a '404 Not Found' if event is not from a WhatsApp API
      res.sendStatus(404);
    }
  } catch (error) {
    console.log(error);
  }
});

// Accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
app.get("/webhook", (req, res) => {
  /**
   * UPDATE YOUR VERIFY TOKEN
   *This will be the Verify Token value when you set up webhook
   **/

  const verify_token = process.env.VERIFY_TOKEN;
  console.log(req.query, "Welcome");
  // Parse params from the webhook verification request
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === "subscribe") {
      // token === verify_token
      // Respond with 200 OK and challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

const welcomeMessageMenu = (phone_number_id, msg_body, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      text: {
        body: msg_body,
      },
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          // text: "Select the option"
          text: msg_body,
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "UNIQUE_BUTTON_ID_1",
                title: "Social Media",
              },
            }
          ],
        },
      },
    },
    headers: { "Content-Type": "application/json" },
  });
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      text: {
        body: "Our outlets",
      },
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          // text: "Select the option"
          text: "Which outlet are you looking for?",
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "UNIQUE_BUTTON_ID_5",
                title: "Dadar",
              },
            },
            {
              type: "reply",
              reply: {
                id: "UNIQUE_BUTTON_ID_6",
                title: "Juhu",
              },
            },
          ],
        },
      },
    },
    headers: { "Content-Type": "application/json" },
  });
  // axios({
  //   method: "POST", // Required, HTTP method, a string, e.g. POST, GET
  //   url:
  //     "https://graph.facebook.com/v12.0/" +
  //     phone_number_id +
  //     "/messages?access_token=" +
  //     token,
  //   data: {
  //     messaging_product: "whatsapp",
  //     to: from,
  //     text: {
  //       body: "",
  //     },
  //     type: "interactive",
  //     interactive: {
  //       type: "button",
  //       body: {
  //         // text: "Select the option"
  //         text: "Which outlet are you looking for?",
  //       },
  //       action: {
  //         buttons: [
  //           {
  //             type: "reply",
  //             reply: {
  //               id: "UNIQUE_BUTTON_ID_5",
  //               title: "Dadar",
  //             },
  //           },
  //           {
  //             type: "reply",
  //             reply: {
  //               id: "UNIQUE_BUTTON_ID_6",
  //               title: "Juhu",
  //             },
  //           }
  //         ],
  //       },
  //     },
  //   },
  //   headers: { "Content-Type": "application/json" },
  // });
}

const noresponse = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        body: "We will contact you",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

const okresponse = (phone_number_id, from, msg_body) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        body: msg_body,
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

const listId1Response= (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        body: " *Monday-Sunday* *-* *11am-12am*",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
}


const listId2Response= (phone_number_id, from) => {
  const options= { timeZone : 'Asia/Kolkata'};
  const currentDate= new Date().toLocaleString('en-US', options);
  const date = new Date(currentDate);
  const hour = date.getHours();
  let answer = false;
  if(hour>=11 && hour<=23){
    answer = true;
  }else {
    answer = false;
  }
  const reply =
    answer === true
      ? "Yes, We are open now"
      : "We are sorry to say that we are closed now";
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        body: reply,
      },
    },
    headers: { "Content-Type": "application/json" },
  });
}

const listId3Response= (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        body: "Here are Photos of the Ambience",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: from,
      type: "document",
      document: {
          filename: "Pritam-Da-Dhaba-AMBIENCE-PHOTOS.pdf",
          link: `${HOST_URL}/static/images/dadar-ambience.pdf`
      }
    },
    headers: { "Content-Type": "application/json" },
  });
}

const listId4Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        body: "Photos of Top Dishes",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: from,
      type: "document",
      document: {
          filename: "Pritam-Da-Dhaba-TOP-DISHES.pdf",
          link: `${HOST_URL}/static/images/dadar-topdishes.pdf`
      }
    },
    headers: { "Content-Type": "application/json" },
  });
};

const listId5Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      text: {
        body: "Menu",
      },
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          // text: "Select the option"
          text: "Please Select Menu type",
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "UNIQUE_BUTTON_ID_7",
                title: "Food Menu",
              },
            },
            {
              type: "reply",
              reply: {
                id: "UNIQUE_BUTTON_ID_8",
                title: "Beverages",
              },
            },
          ],
        },
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};


const listId6Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        body: "Experience the legacy of *Pritam*, spanning over 80 years, rooted in a tale of humble beginnings as a small eatery outside Dadar station, and our journey to becoming a beloved culinary destination in Mumbai and eventually becoming one of the most reputed family-owned hospitality houses in the country.",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: from,
      type: "document",
      document: {
          filename: "Pritam-Da-Dhaba-HIGHLIGHTS.pdf",
          link: `${HOST_URL}/static/images/dadar-highlights.pdf`
      }
    },
    headers: { "Content-Type": "application/json" },
  });
};

const listId7Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "location",
      location: {
        longitude: "72.84640404556183",
        latitude: "19.01673821527208",
        name: "Pritam Da Dhaba, Dadar",
        address:
          "*Pritam* *Da* *Dhaba*, 1, Swami Ganjivandas Marg, Dadar East, Dadar, Mumbai, Maharashtra 400014",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

const listId8Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      text: {
        body: "Order Link",
      },
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          // text: "Select the option"
          text: "Order Link",
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "UNIQUE_BUTTON_ID_9",
                title: "Zomato",
              },
            },
            {
              type: "reply",
              reply: {
                id: "UNIQUE_BUTTON_ID_10",
                title: "Swiggy",
              },
            },
          ],
        },
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

const listId9Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      text: {
        body: "Menu",
      },
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          // text: "Select the option"
          text: "Contact Us",
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "UNIQUE_BUTTON_ID_11",
                title: "Phone",
              },
            },
            {
              type: "reply",
              reply: {
                id: "UNIQUE_BUTTON_ID_12",
                title: "Email",
              },
            }
          ],
        },
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};




const listId10Response= (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        body: " *Monday-Sunday* *-* *12pm-3:30pm* *&* *7pm-12:30am*",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
}


const listId11Response= (phone_number_id, from) => {
  const options= { timeZone : 'Asia/Kolkata'};
  const currentDate= new Date().toLocaleString('en-US', options);
  const date = new Date(currentDate);
  const hour = date.getHours();
  const minute = date.getMinutes();
  let answer = false;
  if(hour>=12 && hour<15 || hour>=19 && hour<=23){
    answer = true;
  }else if(hour===15 && minute<=30){
    answer = true;
  }else if(hour===0 && minute<=30){
    answer = true;
  }else {
    answer = false;
  }
  const reply =
    answer === true
      ? "Yes, We are open now"
      : "We are sorry to say that we are closed now";
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        body: reply,
      },
    },
    headers: { "Content-Type": "application/json" },
  });
}

const listId12Response= (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        body: "Here are Photos of the Ambience",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: from,
      type: "document",
      document: {
          filename: "Pritam-Da-Dhaba-AMBIENCE-PHOTOS.pdf",
          link: `${HOST_URL}/static/images/juhu-ambience.pdf`
      }
    },
    headers: { "Content-Type": "application/json" },
  });
}

const listId13Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        body: "Photos of Top Dishes",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: from,
      type: "document",
      document: {
          filename: "Pritam-Da-Dhaba-TOP-DISHES.pdf",
          link: `${HOST_URL}/static/images/juhu-topdishes.pdf`
      }
    },
    headers: { "Content-Type": "application/json" },
  });
};

const listId14Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      text: {
        body: "Menu",
      },
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          // text: "Select the option"
          text: "Please Select Menu type",
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "UNIQUE_BUTTON_ID_13",
                title: "Food Menu",
              },
            },
            {
              type: "reply",
              reply: {
                id: "UNIQUE_BUTTON_ID_14",
                title: "Beverages",
              },
            },
          ],
        },
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};


const listId15Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        body: "Experience the legacy of *Pritam*, spanning over 80 years, rooted in a tale of humble beginnings as a small eatery outside Dadar station, and our journey to becoming a beloved culinary destination in Mumbai and eventually becoming one of the most reputed family-owned hospitality houses in the country.",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: from,
      type: "document",
      document: {
          filename: "Pritam-Da-Dhaba-HIGHLIGHTS.pdf",
          link: `${HOST_URL}/static/images/juhu-highlights.pdf`
      }
    },
    headers: { "Content-Type": "application/json" },
  });
};

const listId16Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "location",
      location: {
        longitude: "72.82788874140604",
        latitude: "19.09137870773975",
        name: "Pritam Da Dhaba, Juhu",
        address:
          "*ritam* *Da* *Dhaba*, 1st Floor, Bloom Hotel, Juhu Tara Rd, Shivaji Nagr, Juhu, Mumbai, Maharashtra 400049",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

const listId17Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      text: {
        body: "Order Link",
      },
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          // text: "Select the option"
          text: "Order Link",
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "UNIQUE_BUTTON_ID_15",
                title: "Zomato",
              },
            },
            {
              type: "reply",
              reply: {
                id: "UNIQUE_BUTTON_ID_16",
                title: "Swiggy",
              },
            },
          ],
        },
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

const listId18Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      text: {
        body: "Menu",
      },
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          // text: "Select the option"
          text: "Contact Us",
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "UNIQUE_BUTTON_ID_17",
                title: "Phone",
              },
            },
            {
              type: "reply",
              reply: {
                id: "UNIQUE_BUTTON_ID_18",
                title: "Email",
              },
            }
          ],
        },
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};








const buttonId1Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      text: {
        body: "Our Social media",
      },
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          // text: "Select the option"
          text: "Click on the link to visit us",
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "UNIQUE_BUTTON_ID_2",
                title: "Website",
              },
            },
            {
              type: "reply",
              reply: {
                id: "UNIQUE_BUTTON_ID_3",
                title: "Instagram",
              },
            },
            {
              type: "reply",
              reply: {
                id: "UNIQUE_BUTTON_ID_4",
                title: "Facebook",
              },
            },
          ],
        },
      },
    },
    headers: { "Content-Type": "application/json" },
  });
}

const buttonId2Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        preview_url: true,
        body: "Click on the link to visit our https://www.pritamhotels.in/",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

const buttonId3Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        preview_url: true,
        body: "Click on the link for our instagram page https://www.instagram.com/pritamrestaurant/?hl=en",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

const buttonId4Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        preview_url: true,
        body: "Click on the link for our facebook page https://m.facebook.com/people/Pritam-Da-Dhaba/100079235420457/",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

const buttonId5Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: from,
      type: "interactive",
      interactive: {
        type: "list",
        header: {
          type: "text",
          text: "Pritam Da Dhaba, dadar",
        },
        body: {
          text: "FROM HUMBLE BEGINNINGS IN 1942, WE'VE BECOME MUMBAI'S BELOVED CULINARY DESTINATION",
        },
        footer: {
          text: "Click the button to explore more",
        },
        action: {
          button: "About Us",
          sections: [
            {
              title: "Timing",
              rows: [
                {
                  "id": "OUR_SERVICE_1_ID",
                  "title": "Our Timing"
                },
                {
                  "id": "OUR_SERVICE_2_ID",
                  "title": "Is it open now?"
                },
                {
                  "id": "OUR_SERVICE_3_ID",
                  "title": "Ambience Photos"
                },
                {
                  "id": "OUR_SERVICE_4_ID",
                  "title": "Top Dishes"
                },
                // {
                //   "id": "OUR_SERVICE_5_ID",
                //   "title": "Menu"
                // },
                // {
                //   "id": "OUR_SERVICE_6_ID",
                //   "title": "Highlights of Restaurant",
                // },
                // {
                //   "id": "OUR_SERVICE_7_ID",
                //   "title": "Our Location",
                // },
                // {
                //   "id": "OUR_SERVICE_8_ID",
                //   "title": "Order Link",
                // },
                // {
                //   "id": "OUR_SERVICE_9_ID",
                //   "title": "Contact Us",
                // }
              ],
            },
            {
              title: "Photos",
              rows: [
                {
                  id: "OUR_SERVICE_3_ID",
                  title: "Ambience Photos",
                },
                {
                  id: "OUR_SERVICE_4_ID",
                  title: "Top Dishes",
                },
              ],
            },
            {
              title: "Food",
              rows: [
                {
                  id: "OUR_SERVICE_5_ID",
                  title: "Menu",
                },
                {
                  id: "OUR_SERVICE_6_ID",
                  title: "Highlights of Restaurant",
                },
              ],
            },
            {
              title: "Find Us",
              rows: [
                {
                  id: "OUR_SERVICE_7_ID",
                  title: "Our Location",
                },
                {
                  id: "OUR_SERVICE_8_ID",
                  title: "Order Link",
                },
              ],
            },
            {
              title: "Contact",
              rows: [
                {
                  id: "OUR_SERVICE_9_ID",
                  title: "Contact Us",
                },
              ],
            },
          ],
        },
      },
    },
    headers: { "Content-Type": "application/json" },
  });
}

const buttonId6Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: from,
      type: "interactive",
      interactive: {
        type: "list",
        header: {
          type: "text",
          text: "Pritam Da Dhaba, Juhu",
        },
        body: {
          text: "FROM HUMBLE BEGINNINGS IN 1942, WE'VE BECOME MUMBAI'S BELOVED CULINARY DESTINATION",
        },
        footer: {
          text: "Click the button to explore more",
        },
        action: {
          button: "About Us",
          sections: [
            {
              title: "Timing",
              rows: [
                {
                  id: "OUR_SERVICE_10_ID",
                  title: "Timings of Restaurant",
                },
                {
                  id: "OUR_SERVICE_11_ID",
                  title: "Is it open now?",
                },
              ],
            },
            {
              title: "Photos",
              rows: [
                {
                  id: "OUR_SERVICE_12_ID",
                  title: "Ambience Photos",
                },
                {
                  id: "OUR_SERVICE_13_ID",
                  title: "Top Dishes",
                },
              ],
            },
            {
              title: "Food",
              rows: [
                {
                  id: "OUR_SERVICE_14_ID",
                  title: "Menu",
                },
                {
                  id: "OUR_SERVICE_15_ID",
                  title: "Highlights of Restaurant",
                },
              ],
            },
            {
              title: "Find Us",
              rows: [
                {
                  id: "OUR_SERVICE_16_ID",
                  title: "Our Location",
                },
                {
                  id: "OUR_SERVICE_17_ID",
                  title: "Order Link",
                },
              ],
            },
            {
              title: "Contact",
              rows: [
                {
                  id: "OUR_SERVICE_18_ID",
                  title: "Contact Us",
                },
              ],
            },
          ],
        },
      },
    },
    headers: { "Content-Type": "application/json" },
  });
}

const buttonId7Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        body: "Food Menu is here",
      },
    },
    headers: { "Content-Type": "application/json" },
  });

  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: from,
      type: "document",
      document: {
          filename: "Pritam-Da-Dhaba-FOOD-MENU.pdf",
          link: `${HOST_URL}/static/images/food-menu-dadar.pdf`
      }
    },
    headers: { "Content-Type": "application/json" },
  });
};

const buttonId8Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        body: "Beverages Menu is here",
      },
    },
    headers: { "Content-Type": "application/json" },
  });

  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: from,
      type: "document",
      document: {
          filename: "Pritam-Da-Dhaba-BEVERAGE-MENU.pdf",
          link: `${HOST_URL}/static/images/beverages-menu-dadar.pdf`
      }
    },
    headers: { "Content-Type": "application/json" },
  });
};

const buttonId9Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        preview_url: true,
        body: "Pleas click on https://www.zomato.com/mumbai/pritam-da-dhaba-dadar-east/order to visit our Restaurant on Zomato",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

const buttonId10Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        preview_url: true,
        body: "Pleas click on https://www.swiggy.com/restaurants/pritam-da-dhaba-lower-parel-area-matunga-wadala-mumbai-181884 to visit us on Swiggy.",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

const buttonId11Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        preview_url: true,
        body: "Please call on 02224143311",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

const buttonId12Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        preview_url: true,
        body: "Please mail us at pritamrestaurant@gmail.com",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};



const buttonId13Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        body: "Food Menu is here",
      },
    },
    headers: { "Content-Type": "application/json" },
  });

  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: from,
      type: "document",
      document: {
          filename: "Pritam-Da-Dhaba-FOOD-MENU.pdf",
          link: `${HOST_URL}/static/images/food-menu-juhu.pdf`
      }
    },
    headers: { "Content-Type": "application/json" },
  });
};

const buttonId14Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        body: "Beverages Menu is here",
      },
    },
    headers: { "Content-Type": "application/json" },
  });

  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: from,
      type: "document",
      document: {
          filename: "Pritam-Da-Dhaba-BEVERAGE-MENU.pdf",
          link: `${HOST_URL}/static/images/beverages-menu-juhu.pdf`
      }
    },
    headers: { "Content-Type": "application/json" },
  });
};

const buttonId15Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        preview_url: true,
        body: "Pleas click on https://www.zomato.com/mumbai/pritam-da-dhaba-juhu/order to visit our Restaurant on Zomato",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

const buttonId16Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        preview_url: true,
        body: "Pleas click on https://www.swiggy.com/restaurants/pritam-da-dhaba-tara-road-juhu-mumbai-633112 to visit us on Swiggy.",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

const buttonId17Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        preview_url: true,
        body: "Please call on 02224143311",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};

const buttonId18Response = (phone_number_id, from) => {
  axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phone_number_id +
      "/messages?access_token=" +
      token,
    data: {
      messaging_product: "whatsapp",
      to: from,
      type: "text",
      text: {
        // the text object
        preview_url: true,
        body: "Please mail us at pritamrestaurant@gmail.com",
      },
    },
    headers: { "Content-Type": "application/json" },
  });
};








app.post("/sendmessage", (req, res) => {
  try {
    let body = req.body;
    if (body.message && body.image) {
      axios({
        method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        url:
          "https://graph.facebook.com/v12.0/" +
          body.phone_number_id +
          "/messages?access_token=" +
          token,
        data: {
          messaging_product: "whatsapp",
          to: body.recipient,
          type: "text",
          text: {
            // the text object
            body: body.message,
          },
        },
        headers: { "Content-Type": "application/json" },
      });
      for (let i = 0; i < body.image.length; i++) {
        axios({
          method: "POST", // Required, HTTP method, a string, e.g. POST, GET
          url:
            "https://graph.facebook.com/v12.0/" +
            body.phone_number_id +
            "/messages?access_token=" +
            token,
          data: {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: body.recipient,
            type: "image",
            image: {
              link: body.image[i],
            },
          },
          headers: { "Content-Type": "application/json" },
        });
      }
      res.send({ message: "Message and Images sent" });
    } else if (body.image) {
      for (let i = 0; i < body.image.length; i++) {
        axios({
          method: "POST", // Required, HTTP method, a string, e.g. POST, GET
          url:
            "https://graph.facebook.com/v12.0/" +
            body.phone_number_id +
            "/messages?access_token=" +
            token,
          data: {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: body.recipient,
            type: "image",
            image: {
              link: body.image[i],
            },
          },
          headers: { "Content-Type": "application/json" },
        });
      }
      res.send({ message: "Images sent" });
    } else {
      axios({
        method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        url:
          "https://graph.facebook.com/v12.0/" +
          body.phone_number_id +
          "/messages?access_token=" +
          token,
        data: {
          messaging_product: "whatsapp",
          to: body.recipient,
          type: "text",
          text: {
            // the text object
            body: body.message,
          },
        },
        headers: { "Content-Type": "application/json" },
      });
      res.send({ message: "Messagesent" });
    }
  } catch (error) {
    console.log(error);
    res.send({ error: error });
  }
});

app.post("/bulkmessage", (req, res) => {
  try {
    let body = req.body;
    let recipient = body.excel.phone;
    let phone_number_id = body.excel.phone_number_id;
    if (body.message && body.image) {
      for (let j = 0; j < recipient.length; j++) {
        axios({
          method: "POST", // Required, HTTP method, a string, e.g. POST, GET
          url:
            "https://graph.facebook.com/v12.0/" +
            phone_number_id[j] +
            "/messages?access_token=" +
            token,
          data: {
            messaging_product: "whatsapp",
            to: recipient[j],
            type: "text",
            text: {
              // the text object
              body: body.message,
            },
          },
          headers: { "Content-Type": "application/json" },
        });
        for (let i = 0; i < body.image.length; i++) {
          axios({
            method: "POST", // Required, HTTP method, a string, e.g. POST, GET
            url:
              "https://graph.facebook.com/v12.0/" +
              phone_number_id[j] +
              "/messages?access_token=" +
              token,
            data: {
              messaging_product: "whatsapp",
              recipient_type: "individual",
              to: recipient[j],
              type: "image",
              image: {
                link: body.image[i],
              },
            },
            headers: { "Content-Type": "application/json" },
          });
        }
      }
      res.send({ message: "Message and Images sent" });
    } else if (body.image) {
      for (let i = 0; i < body.image.length; i++) {
        axios({
          method: "POST", // Required, HTTP method, a string, e.g. POST, GET
          url:
            "https://graph.facebook.com/v12.0/" +
            phone_number_id[j] +
            "/messages?access_token=" +
            token,
          data: {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: recipient[j],
            type: "image",
            image: {
              link: body.image[i],
            },
          },
          headers: { "Content-Type": "application/json" },
        });
      }
      res.send({ message: "Images sent" });
    } else {
      axios({
        method: "POST", // Required, HTTP method, a string, e.g. POST, GET
        url:
          "https://graph.facebook.com/v12.0/" +
          phone_number_id[j] +
          "/messages?access_token=" +
          token,
        data: {
          messaging_product: "whatsapp",
          to: recipient[j],
          type: "text",
          text: {
            // the text object
            body: body.message,
          },
        },
        headers: { "Content-Type": "application/json" },
      });
      res.send({ message: "Messagesent" });
    }
  } catch (error) {
    console.log(error);
    res.send({ error: error });
  }
});

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (error) {
    console.log({ error: error });
  }
  console.log(`webhook is listening at ${PORT}`);
});
