<label class="radio">
	<input type="radio" name="sharing" value="private" 
	<% if (tool_sharing_status.toLowerCase() == "private") { %>checked<% } %> />
	Private
	<p class="description">This tool is private and can only be seen by the tool owner.</p>
</label>
<label class="radio">
	<input type="radio" name="sharing" value="public" 
	<% if (tool_sharing_status.toLowerCase() == "public") { %>checked<% } %> />
	Public
	<p class="description">This tool is public and may be seen by any user.</p>
</label>
<label class="radio">
	<input type="radio" name="sharing" value="protected" 
	<% if (tool_sharing_status.toLowerCase() == "protected") { %>checked<% } %> />
	Protected
	<p class="description">This tool is shared with members of the following projects:</p>
</label>

<div id="select-projects-list">
	<div class="loading">
		<i class="fa fa-spinner fa-spin"></i>
		<div class="message">Loading projects...</div>
	</div>
</div>

<div class="bottom buttons">
	<button id="save" class="btn btn-primary btn-lg" disabled><i class="fa fa-save"></i>Save</button>
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
</div>
