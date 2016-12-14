<div id="build-info">
	<h2>Build Info</h2>

	<div class="alert alert-info" style="display:none">
		<button type="button" class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
		<strong>Notice: &nbsp;</strong><span class="message"></span>
	</div>
	
	<p>The following parameters are used to configure the build script which is used to build the package. </p>
	<br />
	<div id="build-profile-form"></div>

	<div align="right">
		<label><span class="required"></span>Fields are required</label>
	</div>

	<div class="form-group">
		<div class="panel" id="build-script-accordion">
			<div class="panel-group">
				<div class="panel-heading">
					<label>
					<a class="accordion-toggle" data-toggle="collapse" data-parent="#build-script-accordion" href="#build-script-info">
						<i class="fa fa-minus-circle" />
						Build script
					</a>
					</label>
				</div>
				<div id="build-script-info" class="nested accordion-body collapse in">
					<div id="build-script"></div>
				</div>
			</div>
		</div>
	</div>

	<div class="alert alert-warning" style="display:none">
		<button type="button" class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
		<label>Warning: </label><span class="message">This form contains errors.  Please correct and resubmit.</span>
	</div>
</div>

<div class="bottom buttons">
	<% if (showSave) { %>
	<button id="save" class="btn btn-primary btn-lg"><i class="fa fa-save"></i>Save New Package Version</button>
	<% } else { %>
	<button id="next" class="btn btn-primary btn-lg"><i class="fa fa-arrow-right"></i>Next</button>
	<% } %>
	<button id="prev" class="btn btn-lg"><i class="fa fa-arrow-left"></i>Prev</button>
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
</div>
