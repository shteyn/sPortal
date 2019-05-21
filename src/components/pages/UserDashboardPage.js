import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  updateProfile,
  updateImage,
  deleteUserByUser
} from "../../actions/user";

import UpdateUserProfileForm from "../forms/UpdateUserProfileForm";

class UserDashboardPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.userImageRef = React.createRef();
  }

  deleteUserHandler = id => this.props.deleteUserByUser(id);

  updateProfile = data => this.props.updateProfile(data);

  submitUploadImage = event => {
    event.preventDefault();
    const formData = new FormData();
    formData.set("id", this.props.oneUser._id);
    formData.append("userImage", this.userImageRef.current.files[0]);
    this.props.updateImage(formData);
  };

  render() {
    const {
      firstName,
      lastName,
      aboutMeSection,
      email,
      location,
      studentCourse,
      studentClass,
      userImage,
      githubLink,
      linkedInLink,
      portfolioLink,
      xingLink,
      availability,
      mainFocus
    } = this.props.oneUser;

    let placeholderUrl = require("../../img/placeholderUser.jpeg");

    let formattedAvailability = "";
    if (availability && typeof availability === "string") {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      let tmp = new Date(availability);
      formattedAvailability =
        monthNames[tmp.getMonth()] +
        " " +
        tmp.getDate() +
        ", " +
        tmp.getFullYear();
    }

    return (
      <div className="UserPage">
        <div className="UserPageCont">
          <div className="headerUserPage">
            <div className="profileInfoItem">
              <button className="updateProfileButton">
                {this.props.oneUser._id ? (
                  <UpdateUserProfileForm
                    user={this.props.oneUser}
                    updateProfile={this.updateProfile}
                  />
                ) : null}
              </button>
            </div>
          </div>

          {/*FIRST COLUMN*/}
          <div className="InfoCont">
            <div className="infoBoxCont">
              <div className="userImageUploadCont">
                {!userImage ? (
                  <div>
                    <label
                      htmlFor="imgupload"
                      style={{
                        cursor: "pointer"
                      }}
                    >
                      <div
                        className="userProfileImage"
                        style={{
                          backgroundImage: "url(" + placeholderUrl + ")"
                        }}
                      >
                        <div className="addHoverImg" />
                      </div>
                    </label>
                    <input
                      id="imgupload"
                      ref={this.userImageRef}
                      type="file"
                      name="userImageRef"
                      onChange={this.submitUploadImage}
                      style={{ display: "none" }}
                    />
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor="imgupload"
                      style={{
                        cursor: "pointer",
                        display: "block"
                      }}
                    >
                      <div
                        className="userProfileImage"
                        style={{
                          backgroundImage:
                            "url(" +
                            `${
                              process.env.REACT_APP_API_HOST
                            }/uploads/${userImage}` +
                            ")"
                        }}
                      >
                        <div className="addHoverImg" />
                      </div>
                    </label>
                    <input
                      id="imgupload"
                      ref={this.userImageRef}
                      type="file"
                      name="userImageRef"
                      onChange={this.submitUploadImage}
                      style={{ display: "none" }}
                    />
                  </div>
                )}
              </div>
              <div className="profileInfoCont">
                <div className="profileInfoItem">
                  <h4>First Name</h4>
                  <p>{firstName}</p>
                </div>
                <div className="profileInfoItem">
                  <h4>Last Name</h4>
                  <p>{lastName}</p>
                </div>
                <div className="profileInfoItem">
                  <h4>Email</h4>
                  <p>{email}</p>
                </div>
                <div className="profileInfoItem">
                  <h4>Location</h4>
                  <p>{location}</p>
                </div>
                <div className="profileInfoItem">
                  <h4>Course</h4>
                  <p>{studentCourse}</p>
                </div>
                <div className="profileInfoItem">
                  <h4>Class</h4>
                  <p>{studentClass}</p>
                </div>

                <div className="profileInfoItem">
                  <h4>Main Focus</h4>
                  {mainFocus === "" ? (
                    <p style={{ color: "#da9446" }}>Not updated yet</p>
                  ) : (
                    <p>{mainFocus}</p>
                  )}
                </div>

                <div className="profileInfoItem">
                  <h4>Available from</h4>
                  {formattedAvailability === "" ? (
                    <p style={{ color: "#da9446" }}>Not updated yet</p>
                  ) : (
                    <p>{formattedAvailability}</p>
                  )}
                </div>
              </div>
            </div>

            {/*SECOND COLUMN*/}
            <div className="infoBoxContSecond">
              <div className="nestedInfoBoxCont">
                <h1>About Me</h1>
                {!aboutMeSection ? (
                  <p style={{ color: "#da9446" }}>
                    Please tell about yourself ...
                  </p>
                ) : (
                  <div style={{ wordWrap: "break-word" }}>{aboutMeSection}</div>
                )}
              </div>

              {/*THIRD COLUMN*/}

              <div className="nestedInfoBoxCont">
                <div style={{ marginBottom: "50px", width: "50%" }}>
                  <h1>Links</h1>
                  <div className="linksBoxItems">
                    {!linkedInLink ? (
                      <div className="linksBoxItem">
                        <img src={require("../../img/linkedin.png")} alt="" />
                        <p style={{ color: "#da9446" }}>
                          Please add your LinkedIn URL ...
                        </p>
                        <a
                          style={{ display: "none" }}
                          href={linkedInLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      </div>
                    ) : (
                      <div className="linksBoxItem">
                        <img src={require("../../img/linkedin.png")} alt="" />
                        <a
                          href={linkedInLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <p>{linkedInLink}</p>
                        </a>
                      </div>
                    )}
                    {!githubLink ? (
                      <div className="linksBoxItem">
                        <img src={require("../../img/github.png")} alt="" />
                        <p style={{ color: "#da9446" }}>
                          Please add your Github URL ...
                        </p>
                        <a
                          href={githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      </div>
                    ) : (
                      <div className="linksBoxItem">
                        <img src={require("../../img/github.png")} alt="" />
                        <a
                          href={githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <p>{githubLink}</p>
                        </a>
                      </div>
                    )}
                    {!xingLink ? (
                      <div className="linksBoxItem">
                        <img src={require("../../img/xing.png")} alt="" />
                        <p style={{ color: "#da9446" }}>
                          Please add your Xing URL ...
                        </p>
                        <a
                          href={xingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      </div>
                    ) : (
                      <div className="linksBoxItem">
                        <img src={require("../../img/xing.png")} alt="" />
                        <a
                          href={xingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <p>{xingLink}</p>
                        </a>
                      </div>
                    )}
                    {!portfolioLink ? (
                      <div className="linksBoxItem">
                        <img src={require("../../img/briefcase.png")} alt="" />
                        <p style={{ color: "#da9446" }}>
                          Please add your Portfolio URL ...
                        </p>
                        <a
                          href={portfolioLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      </div>
                    ) : (
                      <div className="linksBoxItem">
                        <img src={require("../../img/briefcase.png")} alt="" />
                        <a
                          href={portfolioLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <p>{portfolioLink}</p>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

UserDashboardPage.propTypes = {
  updateProfile: PropTypes.func.isRequired,
  oneUser: PropTypes.object.isRequired,
  updateImage: PropTypes.func.isRequired,
  deleteUserByUser: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    oneUser: state.oneUser
  };
}

export default connect(
  mapStateToProps,
  { updateProfile, updateImage, deleteUserByUser }
)(UserDashboardPage);
