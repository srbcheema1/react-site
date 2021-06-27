import React, { Component } from "react";
import PropTypes from "prop-types";
import Form from "../../UI/FormValidation/components/form";
import Input from "../../UI/FormValidation/components/input";
import {
  required,
  email,
  integer,
  validAge,
  minLength,
  maxLength,
  exactLength
} from "../../../helperFunctions";

import "./Signup.scss";

class Signup extends Component {
  state = {
    full_name: "",
    email: "",
    gender: "M",
    age: 0,
    phone_number: "",
    city: "",
    state_id: "",
    city_id: "",
    school: "",
    courses: [],
    colleges: [],
    t_and_c: false,
    value: "",
    showsuggetions: true,
    disable_registerbtn: false,
    name_error: ""
  };

  componentDidMount() {
    //this.props.getAllStates();
  }

  onChangeHandler = (name, event) => {
    let item = {};
    item[name] = event.target.value;
    this.setState(item);
  };

  onFocus = () => {
    this.setState({ showsuggetions: true });
  };

  onBlur = () => {
    this.setState({ showsuggetions: false });
  };

  onChange = event => {
    let search_keyword = event.target.value;
    this.setState({
      value: search_keyword
    });
    this.props.FilterLocation(search_keyword);
  };

  selectLocation = location_detail => {
    this.setState({
      value: location_detail.city + ", " + location_detail.state,
      city_id: location_detail.city_id,
      state_id: location_detail.state_id,
      showsuggetions: false
    });
  };

  T_and_C = () => {
    this.setState({ t_and_c: !this.state.t_and_c });
  };

  handleSubmit = event => {
    event.preventDefault();
    this.form.validateAll();
    if (!this.form.hasErrors() & this.state.t_and_c) {
      const payload = {
        full_name: this.state.full_name,
        email: this.state.email,
        phone_number: this.state.phone_number,
        first_name: this.state.full_name.split(" ")[0],
        last_name: this.state.full_name.split(" ")[1],
        age: this.state.age,
        gender: this.state.gender,
        city_id: this.state.city_id,
        state_id: this.state.state_id
      };
      this.props.signUp(payload);
    }
  };

  render() {
    const filteredLocations = this.props.filteredLocations;

    return (
      <div styleName="signup-container">
        <h2 styleName="signup-container__signup-header">Sign up</h2>
        <br />
        <br />

        <Form
          ref={c => {
            this.form = c;
          }}
          styleName="sign-up-form"
          onSubmit={this.handleSubmit.bind(this)}
        >
          <Input
            type="text"
            placeholder="Fullname"
            validations={[
              required,
              value => maxLength(value, 100),
              value => minLength(value, 4)
            ]}
            name="fullname"
            onChange={this.onChangeHandler.bind(this, "full_name")}
          />
          <Input
            placeholder="Email*"
            type="text"
            onChange={this.onChangeHandler.bind(this, "email")}
            validations={[required, email]}
            name="email"
          />
          <Input
            placeholder="Mobile*"
            type="text"
            name="mobile"
            onChange={this.onChangeHandler.bind(this, "phone_number")}
            validations={[required, integer, value => exactLength(value, 10)]}
          />
          <div styleName="age-gender-group">
            <div styleName="age-gender-group__age">
              <Input
                placeholder="Age*"
                name="age"
                type="text"
                validations={[required, integer, value => validAge(value)]}
                onChange={this.onChangeHandler.bind(this, "age")}
              />
            </div>
            <div styleName="gender-group">
              <label className="muted para-font-size">Gender*</label>
              <div styleName="gender-group__radio-btns">
                <div>
                  <Input
                    type="radio"
                    name="gender"
                    value="M"
                    checked
                    onChange={this.onChangeHandler.bind(this, "gender")}
                  />
                  <span>Male</span>
                </div>
                <div>
                  <Input
                    type="radio"
                    name="gender"
                    value="F"
                    onChange={this.onChangeHandler.bind(this, "gender")}
                  />{" "}
                  <span>Female</span>
                </div>
              </div>
            </div>
          </div>
          <div>
            <Input
              placeholder="Enter your City / State*"
              type="text"
              value={this.state.value}
              onChange={this.onChange.bind(this)}
              name="location"
              onFocus={this.onFocus}
              validations={[required]}
            />

            {filteredLocations.length > 0 && this.state.showsuggetions ? (
              <div styleName="autosuggest">
                {filteredLocations.map(item => (
                  <div
                    styleName="locations"
                    onClick={() => this.selectLocation(item)}
                    key={item.city_id}
                  >
                    <span styleName="city">{item.city}</span>
                    {", "}
                    {item.state}
                  </div>
                ))}{" "}
              </div>
            ) : null}
          </div>
          <input
            placeholder="School (Optional)"
            type="text"
            onChange={this.onChangeHandler.bind(this, "school")}
          />
          <input
            placeholder="Current College (Optional)"
            type="text"
            onChange={this.onChangeHandler.bind(this, "colleges")}
          />
          <input
            placeholder="Course Type (Optional)"
            type="text"
            onChange={this.onChangeHandler.bind(this, "courses")}
          />
          <div styleName="terms-group">
            <input
              id="policy"
              type="checkbox"
              name="policy"
              value="1"
              onChange={this.T_and_C}
            />
            <label htmlFor="policy">I accept the Terms and Conditions</label>
          </div>
          <button className="btn-normal btn-orange" type="submit">
            Register
          </button>
          <br />
          <br />
          <span onClick={this.props.ShowLogin}>Already a user ? Sign In</span>
          &nbsp;
          <span
            style={{ float: "right" }}
            onClick={this.props.ShowResetPassword}
          >
            Forgot Password?
          </span>
        </Form>
      </div>
    );
  }
}

Signup.propTypes = {
  getMatchingCities: PropTypes.func,
  getAllStates: PropTypes.func,
  states: PropTypes.array,
  FilterLocation: PropTypes.func,
  filteredStates: PropTypes.array,
  filteredLocations: PropTypes.array,
  signUp: PropTypes.func,
  ShowLogin: PropTypes.func,
  ShowResetPassword: PropTypes.func
};

export default Signup;
