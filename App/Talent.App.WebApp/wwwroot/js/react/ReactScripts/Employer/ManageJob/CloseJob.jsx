import React, {useState} from "react";
import { Button, Form, Modal } from "semantic-ui-react";
import Cookies from 'js-cookie';
//import axios from "axios";



function CloseJob(props) {
  const { open, openJobModal, loadData, jobId } = props;

  const updateCloseJob = () => {
    //var jobData = this.state.jobData;
    var cookies = Cookies.get('talentAuthToken');   
    $.ajax({
        url: 'http://localhost:51689/listing/listing/closeJob' ,
        headers: {
            'Authorization': 'Bearer ' + cookies,
            'Content-Type': 'application/json'
        },
        dataType:'json',
        type: "post",
        data: JSON.stringify(jobId),
        success: function (res) {
            if (res.success == true) {
                TalentUtil.notification.show(res.message, "success", null, null);
                //window.location = "/ManageJobs";
               
            } else {
                TalentUtil.notification.show(res.message, "error", null, null)
            }
            console.log(jobId)
            openJobModal(false);
            //loadData();
     
        }.bind(this)
    })
  }
  

  
  
      return(      
      <Modal
        size='small'
        open={open}
        centered
      >
        <Modal.Header>Close Job</Modal.Header>
        <Modal.Content>
          <p>Are you sure?</p>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => openJobModal(false)}>
            No
          </Button>
          <Button positive onClick={() => updateCloseJob(jobId)}>
            Yes
          </Button>
        </Modal.Actions>
      </Modal>
      )
    }

export default CloseJob;
