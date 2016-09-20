<h1><div class="icon"><i class="fa fa-user"></i></div>My Account</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><i class="fa fa-user"></i>My Account</li>
</ol>

<ul class="nav nav-tabs">
	<li id="profile" class="active">
		<a>My Profile</a>
	</li>

	<li id="permissions">
		<a>Permissions</a>
	</li>

	<% if (config['github_authentication_enabled']) { %>
	<li id="accounts">
		<a>Linked Accounts</a>
	</li>
	<% } %>
</ul>

<div id="user-profile">
</div>

