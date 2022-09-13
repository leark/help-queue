import React, { useCallback } from 'react';
import NewTicketForm from './NewTicketForm';
import TicketList from './TicketList';
import { connect } from 'react-redux';
import TicketDetail from './TicketDetail';
import PropTypes from 'prop-types';
import EditTicketForm from './EditTicketForm';
import * as a from './../actions';

class TicketControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // formVisibleOnPage: false,
      selectedTicket: null,
      editing: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = () => {
    if (this.state.selectedTicket != null) {
      this.setState({
        // formVisibleOnPage: false,
        selectedTicket: null,
        editing: false,
      });
    } else {
      // this.setState((prevState) => ({
      //   formVisibleOnPage: !prevState.formVisibleOnPage,
      // }));
      const { dispatch } = this.props;
      const action = a.toggleForm();
      dispatch(action);
    }
  };

  handleEditClick = (id) => {
    console.log('handleEditClick reached');
    const selectedTicket = this.props.mainTicketList[id];
    this.setState({
      editing: true,
      selectedTicket: selectedTicket,
    });
  };

  handleAddingNewTicketToList = (newTicket) => {
    const { dispatch } = this.props;
    const action = a.addTicket(newTicket);
    dispatch(action);
    const action2 = a.toggleForm();
    dispatch(action2);
    // this.setState({ formVisibleOnPage: false });
    // const newMainTicketList = this.state.mainTicketList.concat(newTicket);
    // this.setState({
    //   mainTicketList: newMainTicketList,
    //   formVisibleOnPage: false,
    // });
  };

  handleEditingTicketInList = (ticketToEdit) => {
    const { dispatch } = this.props;
    const action = a.addTicket(ticketToEdit);
    dispatch(action);
    this.setState({ editing: false, selectedTicket: null });
  };

  handleDeletingTicket = (id) => {
    const { dispatch } = this.props;
    const action = a.deleteTicket(id);
    dispatch(action);
    this.setState({ selectedTicket: null });
  };

  handleChangingSelectedTicket = (id) => {
    const selectedTicket = this.props.mainTicketList[id];
    this.setState({ selectedTicket: selectedTicket });
    // const selectedTicket = this.state.mainTicketList.filter(
    //   (ticket) => ticket.id === id
    // )[0];
    // this.setState({ selectedTicket: selectedTicket });
  };

  render() {
    let currentlyVisibleState = null;
    let buttonText = null;

    if (this.state.editing) {
      currentlyVisibleState = (
        <EditTicketForm
          ticket={this.state.selectedTicket}
          onEditTicket={this.handleEditingTicketInList}
        />
      );
      buttonText = 'Return to Ticket List';
    } else if (this.state.selectedTicket != null) {
      currentlyVisibleState = (
        <TicketDetail
          ticket={this.state.selectedTicket}
          onClickingDelete={this.handleDeletingTicket}
          onClickingEdit={this.handleEditClick}
        />
      );
      buttonText = 'Return to Ticket List';
    } else if (this.props.formVisibleOnPage) {
      currentlyVisibleState = (
        <NewTicketForm onNewTicketCreation={this.handleAddingNewTicketToList} />
      );
      buttonText = 'Return to Ticket List';
    } else {
      currentlyVisibleState = (
        <TicketList
          ticketList={this.props.mainTicketList}
          onTicketSelection={this.handleChangingSelectedTicket}
        />
      );
      buttonText = 'Add Ticket';
    }
    return (
      <React.Fragment>
        {currentlyVisibleState}
        <button onClick={this.handleClick}>{buttonText}</button>
      </React.Fragment>
    );
  }
}

TicketControl.propTypes = {
  mainTicketList: PropTypes.object,
  formVisibleOnPage: PropTypes.bool,
};

const mapStateToProps = (state) => {
  return {
    mainTicketList: state.mainTicketList,
    formVisibleOnPage: state.formVisibleOnPage,
  };
};

TicketControl = connect(mapStateToProps)(TicketControl);

export default TicketControl;
