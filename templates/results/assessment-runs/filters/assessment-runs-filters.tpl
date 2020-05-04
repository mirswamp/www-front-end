<div class="filters panel-group" id="filters-accordion">
	<div class="panel">

		<div class="panel-heading">
			<label>
				<i class="fa fa-filter" ></i>
				Filters
			</label>
			<span id="filter-controls"></span>
			<span class="tag" id="reset-filters"><i class="fa fa-remove"></i></span>
		</div>
		
		<div id="filters-info" class="nested panel-collapse collapse in">
			<div class="filters panel-group">
				<div id="project-filter" class="accordion-body <% if (typeof expanded !== 'undefined' && expanded['project-filter']) { %>in <% } %>collapse" />
				<div id="package-filter" class="accordion-body <% if (typeof expanded !== 'undefined' && expanded['package-filter']) { %>in <% } %>collapse" />
				<div id="tool-filter" class="accordion-body <% if (typeof expanded !== 'undefined' && expanded['tool-filter']) { %>in <% } %>collapse" />
				<div id="platform-filter" class="accordion-body <% if (typeof expanded !== 'undefined' && expanded['platform-filter']) { %>in <% } %>collapse" />
				<div id="date-filter" class="accordion-body <% if (typeof expanded !== 'undefined' && expanded['date-filter']) { %>in <% } %>collapse" />
				<div id="limit-filter" class="accordion-body <% if (typeof expanded !== 'undefined' && expanded['limit-filter']) { %>in <% } %>collapse" />
			</div>
		</div>
	</div>
</div>