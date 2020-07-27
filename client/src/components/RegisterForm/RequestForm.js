import React from 'react'
// import Rout from './routes'
import axios from 'axios'
import form from './form.css';
class RequestForm extends React.Component
{
    constructor(props) {
        super(props)
        this.state={
        createdBy:'',
        department:'',
        departmentArray:[],
        userArray:[],
        user:'',
        message:'',
        loggedInUser:{}
        }
    }
    componentDidMount()
    {
    

        axios.get('http://localhost:3005/department/allDepartments',{
          headers:{
              'x-auth':localStorage.getItem('token')
          }
      })

      .then((response)=>{
          //console.log(response,'in category')
          this.setState(()=>({
              departmentArray:response.data
              
          }))
    })

    axios.get('http://localhost:3005/users/allUsers',{
          headers:{
              'x-auth':localStorage.getItem('token')
          }
      })

      .then((response)=>{
          //console.log(response,'in category')
          this.setState(()=>({
              userArray:response.data
              
          }))
    })
    axios.get('http://localhost:3005/users/loggedinuser',{
        headers:{
            'x-auth':localStorage.getItem('token')
        }
      })

    .then((response)=>{
        //console.log(response,'in category')
        this.setState(()=>({
            loggedInUser:response.data
            
        }))
    })
    }
    handleChange=(e)=>{
        e.persist()
        //console.log(this.state.department)
        //this.selectedValue=e.target.value
        //console.log('tt',this.selectedValue)
        this.setState(()=>({
          [e.target.name] : e.target.value   
        }))
    }
    handleSubmit=(e)=>{
        e.preventDefault() 
        const formData={
            createdBy : this.state.createdBy,
            assignedDepartment : this.state.department,
            assignedUser : this.state.user,
            message : this.state.message
        }
        let msgData = {
            msg: `form created by user`
        };
        axios.post(`http://localhost:3005/requestform/create`,formData,{
        
            headers:{
                'x-auth':localStorage.getItem('token')

            }
        })
        .then(response => {
            console.log(response)
            axios.post(`http://localhost:3005/notification/create`, msgData, {
            headers: {
              'x-auth': localStorage.getItem('token')
            }
            })
            this.props.history.push('/requestform/pending')
        })

        this.setState(()=>({
            createdBy:'',
            department:'',
            user:'',
            message:''
        }))

        // setTimeout(()=>{
        //     this.setState(()=>({
        //         notice : ''
        //     }))

        // },2000)
                
           

      



    }
    render() {
        console.log(this.state.departmentArray)
        return(
            <fieldset>
                 <h2 className="formheader">Send the request to another Department </h2>
            <div className="form-group">
                <form onSubmit={this.handleSubmit} className="formcenter">
                <div className="form-row">


                    <div className="form-group col-md-4"></div>
                    <div className="form-group col-md-4">

                    <label className="headerlabel">Username(Created By) 
                    <select name="createdBy" value={this.state.createdBy} onChange={this.handleChange} className="form-control">
                            <option value="" >Select</option>
                            <option value={this.state.loggedInUser._id} >{this.state.loggedInUser.username}</option>
                           

                        </select>
                    </label>
                    </div>

                    
                    <div className="form-group col-md-4"></div>
                    <div className="form-group col-md-4"></div>
                    <div className="form-group col-md-2">
                    <label className="headerlabel">Department(to assign) 
                        <select name="department" value={this.state.department} onChange={this.handleChange} className="form-control">
                            <option value="" >Select</option>
                            {this.state.departmentArray.filter(((department)=>department._id!==this.state.loggedInUser.department)).map((department)=>{
                                

                            return <option key={department._id}
                            value={department._id}>{department.deptName}</option>
                        })}
                        </select>
                    </label>
                    </div>
                    <div className="form-group col-md-3">
                    <label className="headerlabel">User (to assign)
                        <select name="user"   value={this.state.user}   onChange={this.handleChange} className="form-control">
                            <option value="">Select</option>
                            {this.state.userArray.filter(((user)=>user.department===this.state.department)).map((user)=>{
                            return <option key={user._id}
                            value={user._id}>{user.username}</option>
                        })}
                        </select>
                    </label>
                    </div>
                    <div className="form-group col-md-2"></div>
                    <div className="form-group col-md-4"></div>
                    <div className="form-group col-md-4">
                    <label htmlFor="exampleFormControlTextarea1" className="headerlabel">Message
                        <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" cols="34" value={this.state.message} onChange={this.handleChange} name ="message"></textarea>
                    </label>
                    </div>
                    <div className="form-group col-md-4"></div>
                    <div className="form-group col-md-5"></div>
                    <input type="submit" className="btn btn-primary submit"></input>
                    <div className="form-group col-md-4"></div>
                </div>
                </form>           
            </div>   
            </fieldset>
        )
    }
}
export default RequestForm