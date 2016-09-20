<% if (isAdmin) { %>
<label class="radio">
	<input type="radio" name="sharing" value="public"
	<% if (version_sharing_status.toLowerCase() == "public") { %>checked<% } %> />
	Public
	<p class="description">This package version is public and may be seen by any SWAMP user.</p>
</label>
<label class="radio">
	<input type="radio" name="sharing" value="protected"
	<% if ((version_sharing_status.toLowerCase() == "private") || (version_sharing_status.toLowerCase() == "protected")) { %>checked<% } %> />
	Protected
	<p class="description">This package version is shared with members of the following projects:</p>
</label>
<% } else { %>
	<p class="description">This package version is shared with members of the following projects:</p>
<% } %>

<div id="select-projects-list">
	<div align="center"><i class="fa fa-spinner fa-spin fa-2x"></i><br/>Loading projects...</div>
</div>

<div class="bottom buttons">
	<button id="save" class="btn btn-primary btn-lg" disabled><i class="fa fa-save"></i>Save Sharing</button>
	<% if (showNavigation) { %>
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
	<button id="prev" class="btn btn-lg"><i class="fa fa-arrow-left"></i>Prev</button>
	<button id="start" class="btn btn-lg"><i class="fa fa-fast-backward"></i>Start</button>
	<% } %>
</div>
