<% if (isAdmin) { %>
<label class="radio">
	<input type="radio" name="sharing" value="public"
	<% if (package_sharing_status.toLowerCase() == "public") { %>checked<% } %> />
	Public
	<p class="description">This package version is public and may be seen by any SWAMP user.</p>
</label>
<label class="radio">
	<input type="radio" name="sharing" value="protected"
	<% if ((package_sharing_status.toLowerCase() == "private") || (package_sharing_status.toLowerCase() == "protected")) { %>checked<% } %> />
	Protected
	<p class="description">This package version is shared with members of the following projects:</p>
</label>
<% } else { %>
	<p class="description">This package version is shared with members of the following projects:</p>
<% } %>

<div id="select-projects-list">
	<div class="loading">
		<i class="fa fa-spinner fa-spin"></i>
		<div class="message">Loading projects...</div>
	</div>
</div>

<div class="bottom buttons">
	<button id="save" class="btn btn-primary btn-lg"><i class="fa fa-save"></i>Save New Package</button>
	<button id="prev" class="btn btn-lg" style="display:none"><i class="fa fa-arrow-left"></i>Prev</button>
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
</div>
