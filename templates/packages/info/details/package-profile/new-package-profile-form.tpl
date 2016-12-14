<form action="/" class="form-horizontal" onsubmit="return false;">
	<fieldset>
		<legend>Package info</legend>
		<div class="form-group">
			<label class="required control-label">Name</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" name="name" id="name" maxlength="100" class="required" value="<%- model.get('name') %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body"  title="Name" data-content="The name of your software package, excluding the version."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="form-group">
			<label class="control-label">Description</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="form-control" id="description" name="description" rows="3" maxlength="200"><%- model.get('description') %></textarea>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Description" data-content="Please include a short description of your package. "></i>
					</div>
				</div>
			</div>
		</div>

		<div class="form-group">
			<label class="control-label">External URL</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" name="external-url" id="external-url" value="<%- model.get('external_url') %>"/>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="External URL" data-content="The External URL is the address from which the SWAMP will attempt to clone or pull files for the package. "></i>
					</div>
				</div>
			</div>
		</div>
	</fieldset>
	
	<fieldset>
		<legend>Package version info</legend>
		<div id="new-package-version-profile-form"></div>
	</fieldset>
</form>
