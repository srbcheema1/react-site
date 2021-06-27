import { Component } from "react";
import { withRouter } from "react-router";


class ScrollToTopOnMount extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return null;
  }
}

export default withRouter(ScrollToTopOnMount);