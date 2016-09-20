<h1><div class="icon"><i class="fa fa-comment"></i></div>Contact Us</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><i class="fa fa-comment"></i>Contact Us</li>
</ol>

<% if (contact.support.message) { %>
<%= contact.support.message %>
<% } %>

<% if (contact.support.email || config['email_enabled']) { %>
<h2><i class="fa fa-envelope"></i>Email</h2>
<p>
<% if (contact.support.email) { %>
Email us at <a href="mailto:<%= contact.support.email %>"><%= contact.support.email %></a>.
<% } %>

<% if (config['email_enabled']) { %>
<% if (contact.support.email) { %>
You may also fill out and submit the contact form below. 
<% } else { %>
Please fill out and submit the contact form below. 
<% } %>
<% } %>
<p>

<div class="alert alert-warning" style="display:none">
	<button type="button" class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
	<label>Warning: </label><span class="message">This form contains errors.  Please correct and resubmit.</span>
</div>

<div id="new-contact-profile-form"></div>
<% } %>

<% if (contact.support.phoneNumber) { %>
<h2><i class="fa fa-phone"></i>Phone</h2>
<p>Call <%= contact.support.phoneNumber %> to contact <%= contact.support.description? contact.support.description : 'us' %>. </p>
<% } %>

<% if (contact.security) { %>
<h2><i class="fa fa-user-secret"></i>Security</h2>
<p>To report a security incident, click <a href="#contact/security">here</a>. </p>
<% } %>

<div class="bottom buttons">
	<% if (config['email_enabled']) { %>
	<button id="submit" class="btn btn-primary btn-lg"><i class="fa fa-envelope"></i>Submit</button>
	<% } %>
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
</div>
