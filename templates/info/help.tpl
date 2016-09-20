<h1><div class="icon"><i class="fa fa-question"></i></div>Help</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><i class="fa fa-question"></i>Help</li>
</ol>

<p>Below are resources to help you use the SWAMP application. 
<% if (contact) { %>
<% if (config['email_enabled']) { %>
Please use the <a href="#contact">contact form</a> if you need further assistance. 
<% } %>
You may also call <%= contact.support.phoneNumber %> to contact <%= contact.support.description %>.  <%= contact.support.message %> 
<% if (contact.security) { %>
To report a security incident, click <a href="#contact/security">here</a>. 
<% } %>
<% } %>
</p>

<h2><i class="fa fa-gear"></i>FAQ</h2>
<p><a href="http://continuousassurance.org/faqs/" target="_blank">Continuousassurance.org FAQ (External Link)</a></p>

<h2><i class="fa fa-youtube"></i>Videos</h2>
<p><a href="http://www.youtube.com/channel/UCuQybvosn2J5CC1mAChXDQQ" target="_blank">The SWAMP Channel on YouTube</a></p>

<h2><i class="fa fa-book"></i>User Manual</h2>
<p><a href="http://continuousassurance.org/swamp/SWAMP-User-Manual.pdf" target="_blank">SWAMP User Manual (PDF)</a></p>

<% if (config['api_explorer_enabled']) { %>
<h2><i class="fa fa-compass"></i>API Explorer</h2> 
<p><a href="#api">Explore the SWAMP Application Programmer Interface (REST API)</a></p>
<% } %>