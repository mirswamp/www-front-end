<div class="welcome container">
	<div class="header row">
		<div class="col-sm-7 content">
			<div class="banner">
				<img id="logo" class="img-responsive" src="images/logos/helix-digits.svg" alt="icon" />
				<h1 class="brand">Morgridge</h1>
				<h3 class="brand">Software Assurance</h3>
				<div class="tagline">Do It Early. Do It Often.</div>
			</div>

			<% if (application.config.stats_enabled) { %>
			<div id="banner"></div>
			<% } %>
		</div>

		<div class="col-sm-5 description">
			<br />
			<p>Morgridge Software Assurance is a service that provides continuous software assurance capabilities to developers and researchers. </p>

			<p>This no-cost code analysis service is open to the public. Let us help you to build better, safer, and more secure code today! </p>

			<p>Rather than spending time installing, licensing and configuring software assessment tools on your own machine, let us do the work for you. </p>

			<div class="bottom buttons" style="text-align:center">
				<button id="sign-in" class="btn btn-primary btn-lg visible-xs-inline"><i class="fa fa-chevron-right"></i>Sign In</button>
				<% if (application.config.sign_up_enabled && !application.config.ldap_readonly) { %>
				<button id="sign-up" class="btn btn-lg"><i class="fa fa-pencil"></i>Sign Up!</button>
				<% } %>
			</div>
		</div>
	</div>

	<div class="rows">
		<div class="row" style="padding-bottom:25px">
			<div class="content">
				<h2>Get results in just three steps</h2>
				<div class="col-sm-3">
					<h3>1) Upload your package</h3>
					<p>First, upload your code. Rest assured that it will remain secure.</p>
					<a href="images/screen-shots/add-new-package.png" target="_blank" class="lightbox" title="Create and Upload a New Package"><image class="photo" src="images/screen-shots/add-new-package-thumb.png" alt="upload new package screen shot" /></a>
				</div>
				<div class="col-sm-1"></div>
				<div class="col-sm-3">
					<h3>2) Run your assessment</h3>
					<p>Next, create and run an assessment by choosing a package, tool, and platform.</p>
					<a href="images/screen-shots/add-new-assessment.png" target="_blank" class="lightbox" title="Create and Run an Assessment"><image class="photo" src="images/screen-shots/add-new-assessment-thumb.png" alt="create and run an assessment screen shot" /></a>
				</div>
				<div class="col-sm-1"></div>
				<div class="col-sm-3">
					<h3>3) View your results</h3>
					<p>Last, view your results. Sort and filter by weakness type or file. </p>
					<a href="images/screen-shots/view-results.png" target="_blank" class="lightbox" title="View Assessment Results"><image class="photo" src="images/screen-shots/view-results-thumb.png" alt="view results" /></a>
				</div>
			</div>
		</div>

		<div class="row">
			<div class="content">
				<h2>Why use Software Assurance Tools</h2>
				<div class="column">
					<div class="well">
						<h3>Write more secure code</h3>
						<ul>
							<li>Find SQL injection problems</li>
							<li>Find memory errors</li>
							<li>Find insecure use of library functions</li>
						</ul>
					</div>
				</div>
				<div class="column">
					<div class="well">
						<h3>Write more efficient code</h3>
						<ul>
							<li>Find unreferenced code</li>
							<li>Find unreachable code</li>
							<li>Find unused variables</li>
						</ul>
					</div>
				</div>
				<div class="column">
					<div class="well">
						<h3>Write better code</h3>
						<ul>
							<li>Write more consistent code</li>
							<li>Write more standard code</li>
							<li>Find problems earlier</li>
						</ul>
					</div>
				</div>
			</div>
		</div>

		<div class="row">
			<div class="content">
				<h2>Capabilities</h2>
				<div class="column">
					<div class="well">
						<h3>Static analysis</h3>
						<ul>
							<li>Operates on the original source code</li>
							<li>Tracks problems down to the location in the original code</li>
							<li>Relatively quick and easy to use</li>
							<li>Provides complete code coverage</li>
						</ul>
					</div>
				</div>
				<div class="column">
					<div class="well">
						<h3>Collaborate with others</h3>
						<ul>
							<li>Create projects</li>
							<li>Invite new members</li>
							<li>Share assessment results</li>
						</ul>
					</div>
				</div>
				<div class="column">
					<div class="well">
						<h3>Analyze your results</h3>
						<ul>
							<li>View results</li>
							<li>Compare results from multiple tools</li>
							<li>Find and visualize overlaps</li>
							<li>Correlate results</li>
						</ul>
					</div>
				</div>
			</div>
		</div>

		<div class="row">
			<div class="content">
				<h2>Features</h2>
				<div class="column">
					<div class="well">
						<h3>Languages supported</h3>
						<ul>
							<li>C/C++</li>
							<li>Java source</li>
							<li>Java bytecode</li>
							<li>Python</li>
							<li>Ruby</li>
							<li>PHP</li>
							<li>Javascript</li>
							<li>HTML</li>
							<li>CSS</li>
							<li>XML</li>
							<li>.NET</li>
						</ul>
					</div>
				</div>
				<div class="column">
					<div class="well">
						<a href="#tools/public"><h3>Tools supported</h3></a>
						<label>Open tools</label>
						<ul id="open-tools-list"></ul>
						<label>Commercial tools</label>
						<ul id="commercial-tools-list"></ul>
					</div>
				</div>
				<div class="column">
					<div class="well">
						<a href="#platforms/public"><h3>Platforms supported</h3></a>
						<ul id="platforms-list"></ul>
					</div>
				</div>
			</div>
		</div>

		<div class="row">
			<div class="content">
				<h2>Who can benefit</h2>
				<div class="column">
					<div class="well">
						<h3>Software developers</h3>
						<ul>
							<li>Commercial software developers - create better products</li>
							<li>Open source software developers - write code that will withstand rigorous code review</li>
						</ul>
					</div>
				</div>
				<div class="column">
					<div class="well">
						<h3>Students and educators</h3>
						<ul>
							<li>Learn secure coding practices</li>
							<li>Learn to use industry standard tools</li>
							<li>Learn how to fix the problems the tools report</li>
							<li>Learn to use software assurance tools</li>
						</ul>
					</div>
				</div>
				<div class="column">
					<div class="well">
						<h3>Software assurance professionals</h3>
						<ul>
							<li>SwA tool developers - test SwA tools against hundreds of curated software packages</li>
							<li>SwA researchers - analyze a large body of assessment results from many tools and packages</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</div><!-- container -->
