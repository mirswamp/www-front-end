<form>
	<div class="panel" id="platform-selection">
		<div class="panel-header">
			<h2><i class="fa fa-bars"></i><span class="required">Platform</span></h2>
		</div>
		<div class="panel-body">
			<div class="form-group controls">
				Select a <a href="#platforms/public">platform</a> to use:
				<div id="platform-selector"></div>
			</div>
			<div class="form-group controls">
				Select a version:
				<div id="platform-version-selector"></div>
			</div>
		</div>
	</div>

	<div class="form-group" id="dependency-list">
		<label class="required control-label">Dependency List</label>
		<div class="controls">
			<div class="input-group">
				<input type="text" class="required form-control" />
				<div class="input-group-addon">
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Package Dependencies" data-content="This is a space separated list of packages that this package is dependent upon for a particular platform."></i>
				</div>
			</div>
		</div>
	</div>

	<br /><br />
	<div align="right">
		<label><span class="required"></span>Fields are required</label>
	</div>
</form>


