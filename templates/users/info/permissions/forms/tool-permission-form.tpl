<form class="form-horizontal">
	<fieldset>
		<legend>Tool Permission Agreement</legend>
		
		<h3>User Information</h3>
		<div class="form-group">
			<label class="required control-label">Name</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" name="name" id="name" maxlength="100" class="required">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Name" data-content="Your full name for tool usage."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="form-group">
			<label class="required control-label">Email</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" name="email" id="email" maxlength="100" class="required">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Email" data-content="The email address you would like to use with this tool."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="form-group">
			<label class="required control-label">Organization</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" name="organization" id="organization" maxlength="100" class="required">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Organization" data-content="The organization your belong to.  Please write 'Independent' or 'Open Source' if you do not belong to an organization."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="form-group">
			<label class="required control-label">Project URL</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" name="url" id="project-url" maxlength="100" class="required">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Project URL" data-content="A URL to an informational site containing information about you and / or the code you wish to access with this tool."></i>
					</div>
				</div>
			</div>
		</div>

		<h3 class="required">User Type</h3>
		<div class="form-group">
			<label class="control-label"></label>
			<div class="controls">
				<div class="radio">
					<label>
						<input type="radio" name="user-type" id="open-source" value="open_source">
						Open Source
					</label>
				</div>
				<div class="radio">
					<label>
						<input type="radio" name="user-type" id="educational" value="educational">
						Educational
					</label>
				</div>
				<div class="radio">
					<label>
						<input type="radio" name="user-type" id="government" value="governmental">
						Government
					</label>
				</div>
				<div class="radio">
					<label>
						<input type="radio" name="user-type" id="commercial" value="commercial">
						Commercial
					</label>
				</div>
			</div>
		</div>

		<p>I understand that if I am a Commercial user, Government user or I cannot be sufficiently vetted as an Education User or Open Source Developer, my name and contact information will be shared with the tool owner for approval purposes only.</p>

		<div class="checkbox well">
			<label class="required">
				<input type="checkbox" no-focus name="confirm" class="required">
				I accept
			</label>
		</div>
	</fieldset>
</form>
