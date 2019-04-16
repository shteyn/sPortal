import React, { Component } from "react";
import PropTypes from "prop-types";
import Validator from "validator";

import InlineError from "../messages/InlineError";

class RegistrationForm extends Component {
  state = {
    data: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      location: "",
      studentClass: ""
    },
    loading: false,
    errors: {}
  };

  types = ["Berlin", "Düseeldorf", "Köln", "Hamburg"];

  onChange = event =>
    this.setState({
      data: {
        ...this.state.data,
        [event.target.name]: event.target.value
      }
    });

  onSubmit = event => {
    event.preventDefault();
    const errors = this.validate(this.state.data);
    this.setState({ errors });
    if (Object.keys(errors).length === 0) {
      this.setState({ loading: true });
      this.props.submit(this.state.data).catch(error =>
        this.setState({
          errors: error.response.data.errors,
          loading: false
        })
      );
    }
  };

  //making syntax validation onSubmit();
  validate = data => {
    const errors = {};
    if (!Validator.isEmail(data.email)) errors.email = "Invalid email";
    if (!data.password) errors.password = "Can't be blank";
    return errors;
  };

  render() {
    const { data, errors, loading } = this.state;
    return (
      <div className="RegistrationForm">
        <form onSubmit={this.onSubmit} loading={loading.toString()}>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="example@example.com"
            autoComplete="email"
            value={data.email}
            onChange={this.onChange}
          />
          {/* InlineError server side validation */}
          {errors.email && <InlineError text={errors.email} />}
          <br />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="inserts password"
            autoComplete="current-password"
            value={data.password}
            onChange={this.onChange}
          />
          {errors.password && <InlineError text={errors.password} />}
          <br />
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="insert your first name..."
            value={data.firstName}
            onChange={this.onChange}
          />
          <br />
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="insert your last name..."
            value={data.lastName}
            onChange={this.onChange}
          />
          <br />
          <select name="location" onChange={this.onChange}>
            <option defaultValue>Choose your location...</option>
            {this.types.map((item, i) => (
              <option key={i}>{item}</option>
            ))}
          </select>

          <br />
          <input
            type="number"
            min="0"
            id="studentClass"
            name="studentClass"
            placeholder="insert your class number..."
            value={data.studentClass}
            onChange={this.onChange}
          />
          <br />
          <button>Submit</button>
        </form>
      </div>
    );
  }
}
RegistrationForm.propTypes = {
  submit: PropTypes.func.isRequired
};

export default RegistrationForm;
