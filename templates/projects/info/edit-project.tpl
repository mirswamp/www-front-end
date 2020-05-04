<h1><div class="icon"><i class="fa fa-pencil"></i></div>Edit Project <span class="name"><%= full_name %></span></h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#projects"><i class="fa fa-folder-open"></i>Projects</a></li>
	<li><a href="<%= url %>"><i class="fa fa-folder-open"></i>Project <%= full_name %></a></li>
	<li>Edit Project</li>
</ol>

<div id="project-profile-form"></div>

<div class="bottom buttons">
	<button id="save" class="btn btn-primary btn-lg" disabled><i class="fa fa-save"></i>Save Project</button>
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
</div>
