<h1>
	<div class="icon"><i class="fa fa-user"></i></div><span class="name"><%- name %></span>'s Account
</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#overview"><i class="fa fa-eye"></i>System Overview</a></li>
	<li><a href="#accounts/review"><i class="fa fa-user"></i>Review Accounts</a></li>
	<li><i class="fa fa-user"></i><%- name %>'s Account</li>
</ol>

<ul class="nav nav-tabs">
	<li id="profile" class="active">
		<a><i class="fa fa-user"></i>User Profile</a>
	</li>

	<li id="permissions">
		<a><i class="fa fa-check"></i>Permissions</a>
	</li>

	<li id="passwords">
		<a><i class="fa fa-key"></i>Application Passwords</a>
	</li>

	<% if (application.config.linked_accounts_enabled) { %>
	<li id="accounts">
		<a><i class="fa fa-link"></i>Sign Ins</a>
	</li>
	<% } %>

	<% if (application.config.classes_enabled) { %>
	<li id="classes">
		<a><i class="fa fa-mortar-board"></i>Classes</a>
	</li>
	<% } %>

	<li id="events">
		<a><i class="fa fa-bullhorn"></i>Events</a>
	</li>
</ul>

<div id="user-profile"></div>
