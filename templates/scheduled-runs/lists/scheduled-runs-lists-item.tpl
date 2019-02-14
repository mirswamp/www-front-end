<% if (typeof name !== 'undefined') { %>

<% if (runRequestUrl) { %>
<a href="<%- runRequestUrl %>">
	<h2><i class="fa fa-calendar"></i><%- name %></h2>
</a>
<% } else { %>
<h2><i class="fa fa-calendar"></i><%- name %></h2>
<% } %>

<% if (typeof description !== 'undefined') { %>
<% description = description.toLowerCase(); %> 

<% if (description.startsWith('run')) { %>
<% description = description.replace('run', ''); %>
<% } %>

<% if (description.startsWith('runs')) { %>
<% description = description.replace('runs', ''); %>
<% } %>

<p>The following assessments are run <%= description %></p>
<% } %>
<% } %>

<div class="scheduled-runs"></div>