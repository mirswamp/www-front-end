<h1>
	<div class="icon"><i class="fa fa-gift"></i></div>
	<% if (data['type']) { %>
	Review <span class="name"><%- data['type'] %></span> Packages
	<% } else { %>
	Review All Packages
	<% } %>
</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#overview"><i class="fa fa-eye"></i>System Overview</a></li>
	<li><i class="fa fa-gift"></i>Review Packages</li>
</ol>

<div id="package-filters"></div>
<br />

<div id="review-packages-list">
	<div class="loading">
		<i class="fa fa-spinner fa-spin"></i>
		<div class="message">Loading packages...</div>
	</div>
</div>

<label>
	<input type="checkbox" id="show-numbering" <% if (application.options.showNumbering) { %>checked<% } %>>
	Show numbering
</label>

<div class="bottom buttons">
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
</div>