<h1><div class="icon"><i class="fa fa-wrench"></i></div>Tools</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#resources"><i class="fa fa-book"></i>Resources</a></li>
	<li><i class="fa fa-wrench"></i>Tools</li>
</ol>

<p>Tools are software programs that are used to perform static code analysis on your software source code. <% if (!loggedIn) { %>To see more detailed information about each of the tools listed in this view, log in to the application. <% } %> </p>

<h2>Open tools</h2>
<p>These tools are free for anyone to use without restrictions.</p>
<div id="open-tools-list">
	<div class="loading">
		<i class="fa fa-spinner fa-spin"></i>
		<div class="message">Loading public tools...</div>
	</div>
</div>

<h2>Commercial tools</h2>
<p>These tools may be used with permission. Request access on the Permissions tab of your user account.</p>
<div id="commercial-tools-list">
	<div class="loading">
		<i class="fa fa-spinner fa-spin"></i>
		<div class="message">Loading protected tools...</div>
	</div>
</div>

<label>
	<input type="checkbox" id="show-numbering" <% if (application.options.showNumbering) { %>checked<% } %>>
	Show numbering
</label>