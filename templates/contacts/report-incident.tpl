<h1><div class="icon"><i class="fa fa-user-secret"></i></div>Report Security Incident</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#contact"><i class="fa fa-comment"></i>Contact Us</a></li>
	<li><i class="fa fa-user-secret"></i>Report Security Incident</li>
</ol>

<% if (contact.security.message) { %>
<p><%= contact.security.message %></p>
<% } %>

<% if (contact.security.email || application.config.email_enabled) { %>
<h2><i class="fa fa-envelope"></i>Email</h2>
<p>
<% if (contact.security.email) { %>
Email us at <a href="mailto:<%= contact.security.email %>"><%= contact.security.email %></a>.
<% } %>

<% if (application.config.email_enabled && application.config.contact_form_enabled) { %>
<% if (contact.security.email) { %>
You may also fill out and submit the incident report form below. 
<% } else { %>
Please fill out and submit the incident report form below. 
<% } %>
<% } %>
<p>
<% } %>

<div class="alert alert-warning" style="display:none">
	<button type="button" class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
	<label>Warning: </label><span class="message">This form contains errors.  Please correct and resubmit.</span>
</div>

<div id="new-contact-profile-form"></div>

<% if (contact.security.phoneNumber) { %>
<h2><i class="fa fa-phone"></i>Phone</h2>
<p>Call <%= contact.security.phoneNumber %> to contact <%= contact.security.description? contact.security.description : 'us' %>. </p>
<% } %>

<div class="bottom buttons">
	<% if (application.config.email_enabled && application.config.contact_form_enabled) { %>
	<button id="submit" class="btn btn-primary btn-lg"><i class="fa fa-envelope"></i>Submit</button>
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
	<% } %>
</div>
