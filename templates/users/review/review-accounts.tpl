<h1><div class="icon"><i class="fa fa-user"></i></div>Review <% if (userType) {%><%- userType %> <% } %>Accounts</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#overview"><i class="fa fa-eye"></i>System Overview</a></li>
	<li><i class="fa fa-user"></i>Review Accounts</li>
</ol>

<div id="user-filters"></div>
<br />

<div class="pull-right">
	<span class="required"></span>
	Limit filter includes disabled accounts.
</div>

<label>
	<input type="checkbox" id="show-signed-in-accounts" <%- showSignedInAccounts ? 'checked="checked"' : '' %>>
	Show signed in accounts
</label>

<label>
	<input type="checkbox" id="show-disabled-accounts" <%- showDisabledAccounts ? 'checked="checked"' : '' %>>
	Show disabled accounts
</label>

<div id="review-accounts-list">
	<div align="center"><i class="fa fa-spinner fa-spin fa-2x"></i><br/>Loading user accounts...</div>
</div>

<label>
	<input type="checkbox" id="show-numbering" <% if (showNumbering) { %>checked<% } %>>
	Show numbering
</label>

<div class="bottom buttons">
	<button id="save" class="btn btn-primary btn-lg" disabled><i class="fa fa-save"></i>Save</button>
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
</div>
