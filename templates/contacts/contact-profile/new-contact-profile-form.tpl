<form action="/" class="form-horizontal">
	<div class="form-group">
		<div class="panel-group" id="contact-info-accordion">
			<div class="panel">
				<div class="panel-heading">
					<label>
					<a data-toggle="collapse" data-parent="#contact-info-accordion" href="#contact-info">
						<% if (collapsed) { %>
							<i class="fa fa-plus-circle"></i>
						<% } else { %>
							<i class="fa fa-minus-circle"></i>
						<% } %>
						Your contact info
					</a>
					</label>
				</div>

				<div id="contact-info" class="nested panel-collapse collapse<% if (!collapsed) { %> in<% } %>">
					<p>If you'd like us to contact you with answers to your questions or a response to your feedback, please include your contact information here.</p>

					<div class="form-group">
						<label class="control-label">First name</label>
						<div class="controls">
							<div class="input-group">
								<input type="text" class="form-control" name="first-name" id="first-name" <% if (typeof first_name !== 'undefined') { %>value="<%- first_name %>"<% } %>>
								<div class="input-group-addon">
									<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="First name" data-content="This is the informal name or given name that you are called by."></i>
								</div>
							</div>
						</div>
					</div>

					<div class="form-group">
						<label class="control-label">Last name</label>
						<div class="controls">
							<div class="input-group">
								<input type="text" class="form-control" name="last-name" id="last-name" <% if (typeof last_name !== 'undefined') { %>value="<%- last_name %>"<% } %>>
								<div class="input-group-addon">
									<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Last name" data-content="This is your family name or surname."></i>
								</div>
							</div>
						</div>
					</div>

					<div class="form-group">
						<label class="control-label">Email address</label>
						<div class="controls">
							<div class="input-group">
								<input type="text" class="form-control" name="email" id="email" class="email" <% if (typeof email !== 'undefined') { %>value="<%- email %>"<% } %>>
								<div class="input-group-addon">
									<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Email address" data-content="Please enter an email address if you'd like us to respond to your inquiry."></i>
								</div>
							</div>
						</div>
					</div>
				</div>
				
			</div>
		</div>
	</div>

	<fieldset>
		<legend>Question</legend>

		<div class="form-group">
			<label class="required control-label">Subject</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" name="subject" id="subject">
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Subject" data-content="This is the subject of your question or comment."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="form-group">
			<label class="required control-label">Body</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="required form-control" rows="6" id="question"></textarea>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Body" data-content="Please type your question or comment here."></i>
					</div>
				</div>
			</div>
		</div>
	</fieldset>

	<div align="right">
		<label><span class="required"></span>Fields are required</label>
	</div>	
</form>
