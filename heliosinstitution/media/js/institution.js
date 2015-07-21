$("document").ready(function(){

	$("form.add_inst_email").submit(function(event) { 
        event.preventDefault();
        event.stopImmediatePropagation();
        var form = $(this);
		if (confirm(gettext('Are you sure you want to add this e-mail as an institution admin?'))){
            var email = form.find('input[type=email]').val();
            var url = form.attr('action');
            $.ajax({
                type: "POST",
                url: url,
                data: {'email': email},
                success: function (data) {
                    form.parents('div.div_form').removeClass('has-error');
                    form.parents('div.div_form').addClass('has-success');
                    form.parents('div.div_form').find('span.add_field_result').text(gettext('Email successfully saved.'));
                    $('#institution_users').load($('#institution_users').attr('data-url'));
                },
                error: function (error) {
                    form.parents('div.div_form').removeClass('has-success');
                    form.parents('div.div_form').addClass('has-error');
                    form.parents('div.div_form').find('span.add_field_result').text(gettext('Please, correct the provided value'));
                }
            });
            form.find('input[type=email]').val('');
		}
		return false;
	});
    
    $('.remove_institution_user').click(function(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
		if (confirm(gettext('Are you sure you want to delete this user?'))){
            var url = $(this).attr('href');
            var element = $(this);
            $.ajax({
                type: "POST",
                url: url,
                success: function (data) {
                    element.parents('tr').remove();
                },
                error: function (error) {
                    form.parents('div.div_form').addClass('has-error');
                    form.parents('div.div_form').find('span.add_field_result').text(gettext('Please, correct the provided value'));
                }
            });
		}
		return false;
    });


    var rowNum = 0;
    $('.add_cafe_attribute').click(function(){
        rowNum ++;
        var row = $('#attribute_0').clone();
        $(row).children('input[name=cafe_attribute_values[]]').attr('value','');
        $(row).attr('id','attribute_' + rowNum);
        $(row).children('span:last').attr('class','remove_cafe_attribute input-group-addon  glyphicon glyphicon-minus');
        $(row).insertAfter('#attribute_' + (rowNum - 1));
    });

    $('.remove_cafe_attribute').on('click', function(){
       $(this).parent('div').remove();    
       rowNum --;
       $('.cafe_attribute').each(function(index){ $(this).attr('id', 'attribute_'+ index)});
    });

    $('#update_voter_reg').click(function(event) {
        user_type = $('input[name="user_type"]').val();
        eligibility = $('input[name="eligibility"]:checked').val();
        categories = {}
        if (eligibility == "limitedreg" & user_type == "shibboleth") {
            event.preventDefault();
            event.stopImmediatePropagation();
            var url = $('form#eligibility-form').attr('action');
            $('div.cafe_attribute').each(function(){
                key = $(this).find('select option:selected').text();
                value = $(this).find('input[name="cafe_attribute_values[]"]').val();
                categories[key] = value;
            });          
        }
        data = { 
            'eligibility': eligibility,
            'category_id': categories,
        }  
        $.ajax({
            type: "POST",
            url: url,
            dataType: "json",
            data: JSON.stringify(data),   
            success: function (data) {
                $('div.shib-attr-panel').removeClass('has-error');
                $('div.shib-attr-panel').addClass('has-success');
                $('span.add_attr_result').addClass('label-success');
                $('span.add_attr_result').text(gettext('Attributes successfully saved.'));
                $('label.who_can_vote').html(gettext('Only voters with the specified attributes')); 
            },
            error: function (error) {
                $('div.shib-attr-panel').removeClass('has-success');
                $('div.shib-attr-panel').addClass('has-error');
                $('span.add_attr_result').addClass('label-danger');
                $('span.add_attr_result').text(gettext('Please, correct the provided values.'));
            }
        });
    });

    $('input#idp_type').click(function(){
        $('div.shib-attr-panel').removeClass('hidden');
        $('a#upload_voters').addClass('hidden');
    });

    $('input#csv_type').click(function(){
        $('div.shib-attr-panel').addClass('hidden');
        $('a#upload_voters').removeClass('hidden');
    });

    $('input#logged_type').click(function(){
        $('div.shib-attr-panel').addClass('hidden');
        $('a#upload_voters').addClass('hidden');
    });

    $('#inst_details').on('click', '#edit_inst_button', function(event){
        $('#readonly_inst').addClass('hidden');
        $('#edit_inst').addClass('panel-body');
        $('#edit_inst').removeClass('hidden');
    });

    $('#inst_details').on('click', '#save_inst_data', function(event){
        var url = $('#form_edit_inst').attr('action');
        var inst_data = {}
        $('p.inst_data').each(function(){
            inst_data[$(this).children('.form-control').attr('name')] = $(this).children('.form-control').val();
        });
        $.ajax({
            type: "POST",
            url: url,
            data: inst_data,
            success: function (data) {
                $('#inst_details').load($('#inst_details').attr('data-url'));
            },
            error: function (error) {

            }

        });
        return false;
    });
})
