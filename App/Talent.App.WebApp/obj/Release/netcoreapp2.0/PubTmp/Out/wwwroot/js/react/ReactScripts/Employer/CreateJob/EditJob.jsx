import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { Dropdown } from 'semantic-ui-react'
import { countryOptions } from '../common.js'
import { JobDetailsCard } from './JobDetailsCard.jsx';
import { JobApplicant } from './JobApplicant.jsx';
import { ChildSingleInput } from '../../Form/SingleInput.jsx'
import { JobDescription } from './JobDescription.jsx';
import { JobSummary } from './JobSummary.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';

export default class EditJob extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            jobData: this.props.jobData,
            
            /*{
                id:props.id,
                employerID:props.employerID,
                title: props.title,
                description: props.description,
                summary: props.summary,
                applicantDetails: {
                    yearsOfExperience: { years: props.years, months: props.months },
                    qualifications: props.qualifications,
                    visaStatus:props.visaStatus
                },
                jobDetails: {
                    categories: { category: props.category, subCategory: props.subCategory },
                    jobType: props.jobType,
                    startDate: moment(props.startDate),
                    salary: { from: props.from, to: props.to },
                    location: { country: props.country, city: props.city}
                }
            },*/
            loaderData: loaderData
        }
        
        this.updateStateData = this.updateStateData.bind(this);
        this.addUpdateJob = this.addUpdateJob.bind(this);
        this.loadData = this.loadData.bind(this); 
   
        this.init = this.init.bind(this);
    };

    init() {
        let loaderData = this.state.loaderData;
        loaderData.allowedUsers.push("Employer");
        loaderData.allowedUsers.push("Recruiter");
        loaderData.isLoading = false;
        this.setState({ loaderData, })
    }

    componentDidMount() {
        this.init();
        this.loadData();
    };

    loadData() {
        //const root = "" 
        //var param = root.getAttribute('data-id');
        var param = this.props.match.params.id ? this.props.match.params.id : "";//workaround till we get Redux in to keep the page from breaking
        var copyJobParam = this.props.match.params.copyId ? this.props.match.params.copyId : "";

        if (param != "" || copyJobParam != "") {
            var link = param != "" ? 'http://localhost:51689/listing/listing/GetJobByToEdit?id=' + param
                : 'http://localhost:51689/listing/listing/GetJobForCopy?id=' + copyJobParam;
            var cookies = Cookies.get('talentAuthToken');
            $.ajax({
                url: link,
                headers: {
                    'Authorization': 'Bearer ' + cookies,
                    'Content-Type': 'application/json'
                },
                type: "GET",
                contentType: "application/json",
                dataType: "json",
                success: function (res) {
                    if (res.success == true) {
                        res.jobData.jobDetails.startDate = moment(res.jobData.jobDetails.startDate);
                        res.jobData.jobDetails.endDate = res.jobData.jobDetails.endDate ? moment(res.jobData.jobDetails.endDate) : null;
                        res.jobData.expiryDate = res.jobData.expiryDate
                            ? moment(res.jobData.expiryDate) > moment()
                                ? moment(res.jobData.expiryDate) : moment().add(14,'days') : null;
                        this.setState({ jobData: res.jobData })
                    } else {
                        TalentUtil.notification.show(res.message, "error", null, null)
                    }
                }.bind(this)
            })
        }       
    }
    addUpdateJob() {
        var jobData = this.state.jobData;
        console.log("data to save:", jobData);
        //jobData.jobDetails.startDate = jobData.jobDetails.startDate.toDate();
        console.log("date:", jobData.jobDetails.startDate);
        var cookies = Cookies.get('talentAuthToken');   
        $.ajax({
            url: 'http://localhost:51689/listing/listing/EditUpdateJob',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            dataType:'json',
            type: "post",
            data: JSON.stringify(jobData),
            success: function (res) {
                if (res.success == true) {
                    TalentUtil.notification.show(res.message, "success", null, null);
                    window.location = "/ManageJobs";
                   
                } else {
                    TalentUtil.notification.show(res.message, "error", null, null)
                }
                
            }.bind(this)
        })
    }

    updateStateData(event) {
        const data = Object.assign({}, this.state.jobData)
        data[event.target.name] = event.target.value
        this.setState({
            jobData:data
        })
        console.log(data);
    }
   
    render() {
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <section className="page-body">
                    <div className="ui container">
                        <div className="ui grid">
                            <div className="row">
                                <div className="sixteen wide center aligned padded column">
                                    <h1>Edit Job</h1>
                                </div>
                            </div>

                            <div className="row">
                                <div className="sixteen wide column">
                                    <div className="ui form">
                                        <div className="ui grid">
                                            <div className="row">
                                                <div className="twelve wide column">
                                                    <label>* are required fields. Please enter all required fields.</label>
                                                    <h5>
                                                        *Title:
                                                    </h5>
                                                    <ChildSingleInput
                                                        inputType="text"
                                                        name="title"
                                                        value={this.state.jobData.title}
                                                        controlFunc={this.updateStateData}
                                                        maxLength={80}
                                                        placeholder="Enter a title for your job"
                                                        errorMessage="Please enter a valid title"
                                                    />
                                                    <h5>
                                                        *Description:
                                                    </h5>
                                                    <JobDescription
                                                        description={this.state.jobData.description}
                                                        controlFunc={this.updateStateData}
                                                    />
                                                    <br />
                                                    <h5>
                                                        *Summary:
                                                    </h5>
                                                    <JobSummary
                                                        summary={this.state.jobData.summary}
                                                        updateStateData={this.updateStateData} />
                                                    <br />

                                                    <br />
                                                    <JobApplicant
                                                        applicantDetails={this.state.jobData.applicantDetails}
                                                        updateStateData={this.updateStateData}
                                                    />
                                                    <br />
                                                </div>
                                                <div className="four wide column">
                                                    <JobDetailsCard
                                                        expiryDate={this.state.jobData.expiryDate}
                                                        jobDetails={this.state.jobData.jobDetails}
                                                        updateStateData={this.updateStateData}
                                                        EditClick={this.addUpdateJob}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                    <br />
                </section>
            </BodyWrapper>
        )
    }
}