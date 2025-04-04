# -*- coding: utf-8 -*-
{
    'name': 'Common Web Widgets (OM)',
    'version': '1.0',
    'summary': 'Shared web components like YearsWidget',
    'description': """Contains common web widgets like the YearsWidget.""",
    'category': 'Hidden', # Usually, widget/library modules are hidden
    'author': 'Your Name', # Можете заменить на ваше имя
    'website': '', # Ссылка на ваш сайт/проект, если есть
    'depends': ['web'], # Зависит только от 'web' для работы с виджетами
    'data': [], # Обычно нет серверных данных (views, etc.)
    'assets': {
        'web.assets_backend': [
            # Указываем пути к ресурсам внутри ЭТОГО модуля
            'om_web_widgets/static/src/js/years_widget.js',
            # XML template is now embedded in JS, remove from assets
            # 'om_web_widgets/static/src/xml/years_widget.xml',
            'om_web_widgets/static/src/scss/years_widget.scss',
        ],
        'web.assets_frontend': [], # Если виджет нужен и на сайте
    },
    'installable': True,
    'application': False, # Это не самостоятельное приложение
    'auto_install': False, # Устанавливать вручную или как зависимость
    'license': 'LGPL-3',
} 