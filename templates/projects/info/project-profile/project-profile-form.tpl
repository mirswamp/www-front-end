<form action="/" class="form-horizontal">
	<div class="form-group">
		<label class="required control-label">Full name</label>
		<div class="controls">
			<div class="input-group">
				<input type="text" class="required form-control" name="full-name" id="full-name" value="<%- full_name %>">
				<div class="input-group-addon">
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Full name" data-content="The project full name is the long version of your project's name."></i>
				</div>
			</div>
		</div>
	</div>
	
	<div class="form-group">
		<label class="required control-label">Short name</label>
		<div class="controls">
			<div class="input-group">
				<input type="text" class="required form-control" name="short-name" id="short-name" value="<%- short_name %>">
				<div class="input-group-addon">
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Short name" data-content="The project short name or alias is the short version of your project's name."></i>
				</div>
			</div>
		</div>
	</div>

	<div class="form-group">
		<label class="required control-label">Description</label>
		<div class="controls">
			<div class="input-group">
				<textarea rows="6" class="required form-control" name="description" maxlength="500" id="description"><%- description %></textarea>
				<div class="input-group-addon">
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Description" data-content="Please include a short description of your project."></i>
				</div>
			</div>
		</div>
	</div>

	<div class="tool-owner-options form-group" style="display:none">
		<label class="control-label">Use public tools</label>
		<div class="controls">
			<input type="checkbox" id="use-public-tools" <% if (!exclude_public_tools_flag) { %>checked<% } %>>
		</div>
	</div>

	<div align="right">
		<label><span class="required"></span>Fields are required</label>
	</div>
</form>
