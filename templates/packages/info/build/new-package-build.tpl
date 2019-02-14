<div class="alert alert-info" style="display:none">
	<button type="button" class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
	<label>Notice: </label><span class="message"></span>
</div>

<div id="build-profile-form"></div>

<div class="form-group" style="display:none">
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

<div class="bottom buttons">
	<% if (show_save) { %>
	<button id="save" class="btn btn-primary btn-lg"><i class="fa fa-save"></i>Save New Package</button>
	<% } else { %>
	<button id="next" class="btn btn-primary btn-lg"><i class="fa fa-arrow-right"></i>Next</button>
	<% } %>
	<button id="prev" class="btn btn-lg" style="display:none"><i class="fa fa-arrow-left"></i>Prev</button>
	<% if (show_source_files) { %>
	<button id="show-source-files" class="btn btn-lg"><i class="fa fa-file"></i>Show Source Files</button>
	<% } %>
	<% if (show_build_script) { %>
	<button id="show-build-script" class="btn btn-lg"><i class="fa fa-code"></i>Show Build Script</button>
	<% } %>
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
</div>