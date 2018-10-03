<h1><span class="name"><%- full_name %></span> Project Members</h1>

<div id="members-list">
	<div align="center"><i class="fa fa-spinner fa-spin fa-2x"></i><br/>Loading project members...</div>
</div>

<div class="bottom buttons">
	<% if (isAdmin && !isTrialProject) { %>
	<button id="invite" class="btn btn-primary btn-lg"><i class="fa fa-envelope"></i>Invite New Members</button>
	<button id="submit" class="btn btn-lg"><i class="fa fa-plus"></i>Submit</button>
	<% } %>
</div>