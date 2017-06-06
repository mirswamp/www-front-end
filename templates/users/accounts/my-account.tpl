<h1><div class="icon"><i class="fa fa-user"></i></div>My Account</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><i class="fa fa-user"></i>My Account</li>
</ol>

<ul class="nav nav-tabs">
	<li id="profile" class="active">
		<a><i class="fa fa-user"></i>My Profile</a>
	</li>

	<li id="permissions">
		<a><i class="fa fa-check"></i>Permissions</a>
	</li>

	<% if (config['linked_accounts_enabled']) { %>
	<li id="accounts">
		<a><i class="fa fa-link"></i>Linked Accounts</a>
	</li>
	<% } %>

	<li id="passwords">
		<a><i class="fa fa-key"></i>Application Passwords</a>
	</li>
</ul>

<div id="user-profile">
</div>

