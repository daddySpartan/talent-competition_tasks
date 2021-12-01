﻿import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Header, Dropdown, Checkbox, Accordion, Form, Segment, Card, Button, Label, Placeholder } from 'semantic-ui-react';
import {Job} from '../../EmployerFeed/Job.jsx';
import moment from 'moment';
import SelectFilter from './SelectFilter.jsx';
import SelectSort from './SelectSort.jsx';
import PageChange from './PageChange.jsx';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: false,
                showClosed: false,
                showDraft: false,
                showExpired: false,
                showUnexpired: false
            },
            totalPages: 1,
            activeIndex: [],
            startIndex: 0,
            endIndex: 2
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        this.expiryData = this.expiryData.bind(this);
        this.handleFilterSelect = this.handleFilterSelect.bind(this);
        this.changePage= this.changePage.bind(this);
        //your functions go here
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
        this.loadData(() =>
            this.setState({ loaderData })
        )
        
        console.log(this.state.loaderData)
    }

    componentDidMount() {
        this.loadData();
    };
    //componentDidUpdate() {this.init()};
    componentWillUnmount() {this.init()};
    loadData() {
        var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            data: {
                activePage: 1,
                sortbyDate: this.state.sortBy.date,
                showActive:this.state.filter.showActive,
                showClosed:this.state.filter.showClosed,
                showDraft:this.state.filter.showDraft,
                showExpired:this.state.filter.showExpired,
                showUnexpired:this.state.filter.showUnexpired,
                //employerId: "61a0e2d8d31c0f8600c143ff",
              


            },

            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                console.log(res);
                let jobData = null;
                if (res.myJobs) {
                    jobData = res.myJobs
                    console.log("jobData", jobData)
                    this.setState((state) => { 
                        return {
                            loadJobs: jobData,
                            activeIndex: jobData.slice(state.startIndex,state.endIndex)
                        } })
                    console.log(this.state.loadJobs)
                }
            //this.updateWithoutSave(jobData)
            this.init()
            }.bind(this),
            error: function (res) {
                console.log(res.status)
            }
        }) 
        //this.init()
  // your ajax call and other logic goes here
    }
    //updates component's state without saving data
    /*updateWithoutSave(newData) {
        let newSD = Object.assign({}, this.state.loadJobs, newData)
        this.setState({
            loadJobs: newSD
        })
        this.setState((state) => { return {loadJobs: newData} })
        console.log(loadJobs)
    }*/

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    expiryData(expiryDate) {          
      
        if (moment(expiryDate) > moment()) 
            { return(false) }
        else { return(true)}  
     
    }      
    

    handleFilterSelect(setFilter){
        console.log(setFilter);

        switch (setFilter) {
            case 'All':
                return this.setState({          
                        filter: {
                            showActive: true,
                            showClosed: false,
                            showDraft: false,
                            showExpired: true,
                            showUnexpired: true
                        },
                       
                    } 
                );
            case 'Unexpired':
                return this.setState({            
                        filter: {
                            showActive: true,
                            showClosed: false,
                            showDraft: false,
                            showExpired: false,
                            showUnexpired: true
                        },
                    } 
                );

            case 'Expired':
                return this.setState({            
                        filter: {
                            showActive: true,
                            showClosed: false,
                            showDraft: false,
                            showExpired: true,
                            showUnexpired: false
                        },
                    } 
                );
            case 'Descending':
                return this.setState({            
                        sortBy: {
                            date: 'desc',
                        },
                    } 
                );
            case 'Ascending':
                return this.setState({            
                        sortBy: {
                            date: 'ascd',
                        },
                    } 
                );       
         }
    }

    changePage (setStart,setEnd,setActivePage) { 
        this.setState((state) => { return {startIndex: setStart, endIndex: setEnd, activePage: setActivePage} })
        this.setState((state) => {
            return {activeIndex: state.loadJobs.slice(state.startIndex, state.endIndex)}
        })
    }



    render() {

        const {loadJobs, activeIndex, activePage} = this.state;

        if (loadJobs.length > 0) {
            return (
                <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className ="ui container">

                <Segment basic >
                    <Header as='h1'>List of Jobs</Header>
                    <Icon name = 'filter'/>Filter :  
                    <SelectFilter handleFilterSelect={this.handleFilterSelect}/>
                    <Icon name = 'calendar'/>Sort by Date :  
                    <SelectSort handleFilterSelect={this.handleFilterSelect}/>
                </Segment>

                    <Segment basic>
                        <Card.Group centered>
                        {activeIndex.map((j) => {
                            return (

                            <Card key = {j.id}>
                                <Card.Content>
                                    <Card.Header>{j.title}</Card.Header>
                                    <Label as='a' color='orange' ribbon='right' >
                                    <Icon name = 'user'/>
                                    {j.noOfSuggestions}
                                    </Label>

                                    <Card.Meta>{j.location.city} {j.location.country}</Card.Meta>
                                    <Card.Description padding-bottom = '100px'>
                                    <strong  >We have a position for a {j.title}</strong>
                            

                                    </Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                    <div className='ui three buttons'>
                                        { this.expiryData(j.expiryDate)
                                            ? <Button negative size= 'mini' floated='left'>Expired</Button>
                                            : <Button positive size= 'mini' floated='left'>Active</Button>
                                        }

                                    
                                    <Button.Group size = 'mini' floated = 'right' basic color='blue'>
                                        <Button >
                                            Close
                                        </Button>
                                        <Button >
                                            Edit
                                        </Button>
                                        <Button >
                                            Copy
                                        </Button>
                                    </Button.Group>   
                                </div>
                                
                                </Card.Content>
                            </Card>
                            )})}

        
                    </Card.Group>
                    </Segment>
 
                    <Segment basic textAlign = {"center"}>
                    <PageChange data={loadJobs} changePage={this.changePage} activePage={activePage}/>
                    </Segment>
                </div>
                </BodyWrapper>
            )
        }
        else
        {            
            return (
                <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className ="ui container">
                    <Segment basic >
                        <Header as='h1'>List of Jobs</Header>
                        <Icon name = 'filter'/>Filter :  
                        <SelectFilter handleFilterSelect={this.handleFilterSelect}/>
                        <Icon name = 'calendar'/>Sort by Date :  
                        <SelectSort handleFilterSelect={this.handleFilterSelect}/>
                    </Segment>
                    <Segment basic> No jobs found </Segment>       
                    <Segment basic textAlign = {"center"}>
                    <PageChange data={loadJobs} changePage={this.changePage} activePage={activePage}/>
                    </Segment>
                </div>
                </BodyWrapper>
            )
        }
    }
    
}