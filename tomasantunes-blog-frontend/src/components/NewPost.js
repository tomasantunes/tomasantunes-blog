import React, { useRef, useState } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import config from '../config.json';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function NewPost() {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState();
  var quillObj;   

  function changeTitle(e) {
	setTitle(e.target.value);
  }

  function changeTags(e) {
	setTags(e.target.value);
  }

  function requestSubmitPost(title, tags, content) {
		var data = {
			title,
			tags,
			content
		}
		axios.post(config.BASE_URL + '/api/add-post', data)
		.then((response) => {
			if (response.data.status == "OK") {
			alert("Post submitted successfully");
			}
			else {
			alert(response.data.error);
			}
		})
		.catch((err) => {
			alert(err.message);
		});
  }

	async uploadFiles(uploadFileObj,filename,quillObj){
		var libraryName="ImageFiles";
		var context=this.props.context;
		var siteUrl=this.props.context.pageContext.site.absoluteUrl;

		var currentdate=new Date();
		var fileNamePredecessor=currentdate.getDate().toString()+currentdate.getMonth().toString()+currentdate.getFullYear().toString()+currentdate.getTime().toString();

		filename=fileNamePredecessor+filename;

		//To Upload in root folder
		var apiUrl=`${siteUrl}/_api/Web/Lists/getByTitle('${libraryName}')/RootFolder/Files/Add(url='${filename}',overwrite=true)`;
		const digestCache:IDigestCache=this.props.context.serviceScope.consume(DigestCache.serviceKey);
			digestCache.fetchDigest(
			this.props.context.pageContext.web.serverRelativeUrl)
			.then(async(digest:string):Promise<void>=>{
			try {
				if(uploadFileObj!=''){
					fetch(apiUrl,{
					method:'POST',
					headers:{
						'Content-Type':'application/json;odata=verbose',
						"X-RequestDigest":digest
					},	
						body:uploadFileObj
					}).then((response)=>{
						console.log(response);
						const range=quillObj.getEditorSelection();

						var res=siteUrl+"/"+listName+"/"+filename;

						quillObj.getEditor().insertEmbed(range.index,'image',res);
					}).catch((error)=>
						console.log(error)
					);
				}
			}
			catch(error){
				console.log('uploadFiles:' + error);
			}

		});
	}

  const submitPost = () => {
	requestSubmitPost(title, tags, content);
  };

  return (
	<>
	  <Sidebar />
	  <div className="p-5" style={{marginLeft: "280px", width: "calc(100% - 280px"}}>
		<h1>New Post</h1>
		<div className="form-group mb-2">
		  <label>Title</label>
		  <input type="text" className="form-control" value={title} onChange={changeTitle} />
		</div>
		<div className="form-group mb-4">
		  <label>Tags</label>
		  <input type="text" className="form-control" value={tags} onChange={changeTags} />
		</div>
		
	<ReactQuill
			ref={(el)=>{
				quillObj=el;
			}}
			value={this.state.Description}
			modules={{
				toolbar:{
					container:[
						[{'header':[1,2,3,4,5,6,false]}],
						['bold','italic','underline'],
						[{'list':'ordered'},{'list':'bullet'}],
						[{'align':[]}],
						['link', 'image'],
						['clean'],
						[{'color':[]}]
					],
					handlers: {
						image: imageHandler
					}
				},
				table: true
			}}
			placeholder="Add a description of your event"
			onChange={(content, delta, source, editor) => onDescriptionChange(content,editor)}
			id="txtDescription" 
		/>
		<div style={{textAlign: "right", marginTop: "20px"}}>
		  <button className="btn btn-primary" onClick={submitPost}>Submit</button>
		</div>
	  </div>
	</>
  )
}
