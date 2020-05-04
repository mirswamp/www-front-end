<h1>
	<div class="icon"><i class="fa fa-pencil"></i></div>Edit <span class="name"><%- name %></span>'s User Profile
</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#overview"><i class="fa fa-eye"></i>System Overview</a></li>
	<li><a href="#accounts/review"><i class="fa fa-eye"></i>Review Accounts</a></li>
	<li><a href="<%= url %>"><i class="fa fa-user"></i><%- name %>'s Account</a></li>
	<li><i class="fa fa-pencil"></i>Edit Profile</li>
</ol>

<div class="alert alert-warning" style="display:none">
	<button type="button" class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
	<label>Warning: </label><span class="message">This form contains errors.  Please correct and resubmit.</span>
</div>
		
<div id="user-profile-form"></div>

<div class="bottom buttons">
	<button id="save" class="btn btn-primary btn-lg" disabled><i class="fa fa-save"></i>Save</button>
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
</div>
