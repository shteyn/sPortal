import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Table, Button } from "semantic-ui-react";
import { approveUser, deleteUser } from "../../actions/user";

class WaitingUsersForm extends Component {
  constructor(props) {
    super(props);
    this.deleteUserHandler.bind(this);
  }
  approveUser = id => {
    this.props.approveUser(id).then(this.setState({}));
  };

  deleteUserHandler = id => {
    this.props.deleteUser(id);
  };
  render() {
    const { allUsers } = this.props.allUsers;

    return (
      <div>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Course</Table.HeaderCell>
              <Table.HeaderCell>Location</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Class</Table.HeaderCell>
              <Table.HeaderCell>E-Mail</Table.HeaderCell>
              <Table.HeaderCell>User Status</Table.HeaderCell>
              <Table.HeaderCell>Approve Student</Table.HeaderCell>
              <Table.HeaderCell>Reject Student</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {allUsers.map(oneUser => {
              if (
                oneUser.confirmationEmailSend === true &&
                !oneUser.confirmed
              ) {
                return (
                  <Table.Row key={oneUser._id}>
                    <Table.Cell>{oneUser.studentCourse}</Table.Cell>
                    <Table.Cell>{oneUser.location}</Table.Cell>
                    <Table.Cell>
                      {oneUser.firstName} {oneUser.lastName}
                    </Table.Cell>
                    <Table.Cell>{oneUser.studentClass}</Table.Cell>
                    <Table.Cell>{oneUser.email}</Table.Cell>
                    <Table.Cell>
                      {oneUser.confirmed ? "Approved" : "Not Approved"}
                    </Table.Cell>

                    <Table.Cell>
                      <Button
                        onClick={this.approveUser.bind(this, oneUser._id)}
                        style={{
                          color: "#1d3b8b"
                        }}
                      >
                        {"Approve"}
                      </Button>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        style={{
                          backgroundColor: "#1d3b8b",
                          color: "white"
                        }}
                        onClick={deleteUser => {
                          if (window.confirm("Are you sure?"))
                            this.deleteUserHandler(oneUser._id, deleteUser);
                        }}
                      >
                        Reject
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                );
              } else {
                return null;
              }
            })}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

WaitingUsersForm.propTypes = {
  approveUser: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired
};

export default connect(
  null,
  { approveUser, deleteUser }
)(WaitingUsersForm);
