import _ from "lodash";
import React from "react";
import request from "axios";
import timeago from "timeago";
import api from "./api";
import transformers from "./feed-transformers";

export default class Feed extends React.Component {
  state = {
    messages: [],
  };

  componentDidMount() {
    this.updateFeed();
  }

  async updateFeed() {
    const res = await request.get(api("feeds"));
    const messages = _(res.data)
      .map((messages, type) => transformers[type](messages))
      .flatten()
      .value();

    this.setState({
      messages: _(messages)
        .sortBy("timestamp")
        .reverse()
        .value()
        .slice(0, 40),
    });
  }

  render() {
    const messages = this.state.messages.map((message, i) => {
      let image = <img src={message.image} />;

      if (message.imageLink) {
        image = (
          <a target="_blank" href={message.imageLink} rel="noopener noreferrer">
            {image}
          </a>
        );
      }

      return (
        <div className="message" key={i}>
          <div className="message__image">{image}</div>
          <div className="message__content">
            <div className="message__user">
              <a href={message.userLink}>{message.user}</a>
            </div>
            <div
              className="message__body"
              dangerouslySetInnerHTML={{ __html: message.body }}
            ></div>
            <div className="message__icon">
              <i className={`fa fa-${message.type}`}></i>
            </div>
            <div className="message__details">
              <span className="message__timestamp">
                {timeago(message.timestamp)}
              </span>
              <span className="message__meta">{message.meta}</span>
            </div>
          </div>
        </div>
      );
    });

    return <div className="feed">{messages}</div>;
  }
}
