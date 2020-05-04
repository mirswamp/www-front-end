<h1><div class="icon"><i class="fa fa-envelope"></i></div><span class="name"><%- full_name %></span> Project Invitations</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#projects"><i class="fa fa-folder-open"></i>Projects</a></li>
	<li><a href="#projects/<%- project_uid %>"><i class="fa fa-folder-open"></i>Project <%- full_name %></a></li>
	<li>Project Invitations</li>
</ol>

<h2><i class="fa fa-envelope"></i>Sent Project Invitations</h2>
<div id="project-invitations-list">
	<div class="loading">
		<i class="fa fa-spinner fa-spin"></i>
		<div class="message">Loading project invitations...</div>
	</div>
</div>
<br />

<h2><i class="fa fa-envelope-open"></i>New Project Invitations</h2>
<div id="new-project-invitations-list"></div>

<div class="bottom buttons">
	<button id="add" class="btn btn-primary btn-lg"><i class="fa fa-plus"></i>Add Invitation</button>
	<button id="send" class="btn btn-lg"><i class="fa fa-envelope"></i>Send</button>
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
</div>