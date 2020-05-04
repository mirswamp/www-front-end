<h1><div class="icon"><i class="fa fa-bars"></i></div>Platforms</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#resources"><i class="fa fa-book"></i>Resources</a></li>
	<li><i class="fa fa-bars"></i>Platforms</li>
</ol>

<p>Platforms are underlying operating systems and support files that are used to build and run software packages. </p>

<p>The following platforms are available to all SWAMP users. <% if (!loggedIn) { %>To see more detailed information about each of the platfoms listed in this view, log in to the SWAMP. <% } %> </p>

<div id="platforms-list">
	<div class="loading">
		<i class="fa fa-spinner fa-spin"></i>
		<div class="message">Loading platforms...</div>
	</div>
</div>

<label>
	<input type="checkbox" id="show-numbering" <% if (application.options.showNumbering) { %>checked<% } %>>
	Show numbering
</label>