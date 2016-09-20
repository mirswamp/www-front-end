<form action="/" class="form-horizontal" onsubmit="return false;">
	<fieldset>
		<legend>Android bytecode build info</legend>

		<div class="form-group">
			<label class="required control-label">Build system</label>
			<div class="controls">
				<select id="build-system" name="build-system" data-toggle="popover" data-placement="right" title="Build System" data-content="This is the name of the system used to build the package." >
					<option <% if (build_system == 'android-apk') { %> selected <% } %>
						value="android-apk">Android APK</option>
				</select>
			</div>
		</div>
	</fieldset>
</form>