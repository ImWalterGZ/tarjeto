# Tarjeto Mobile Integration Guide

## Overview

## Base Configuration

### API Configuration

Create a configuration file `lib/config/api_config.dart`:

```dart
class ApiConfig {
  static const String baseUrl = 'http://www.api.tarjeto.app/';  // Development



  static const Map<String, String> defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
}
```

### Authentication Service

Create an authentication service `lib/services/auth_service.dart`:

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthService {
  final storage = const FlutterSecureStorage();

  // Login
  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/api/auth/login'),
        headers: {...ApiConfig.defaultHeaders,
                  "cliente": "flutter"} ,
        body: json.encode({
          'email': email,
          'contrasena': password,
        }),
      );

      final data = json.decode(response.body);

      if (response.statusCode == 200 && data['success']) {
        // Store the token securely
        await storage.write(key: 'auth_token', value: data['token']);
        return data;
      } else {
        throw Exception(data['message'] ?? 'Error en el inicio de sesión');
      }
    } catch (e) {
      throw Exception('Error de conexión: $e');
    }
  }

  // Get stored token
  Future<String?> getToken() async {
    return await storage.read(key: 'auth_token');
  }

  // Logout
  Future<void> logout() async {
    await storage.delete(key: 'auth_token');
  }
}
```

## API Services

### Client Profile Service

Create `lib/services/client_service.dart`:

```dart
class ClientService {
  final AuthService _authService = AuthService();

  // Get client profile
  Future<Map<String, dynamic>> getProfile() async {
    final token = await _authService.getToken();
    if (token == null) throw Exception('No auth token found');

    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/api/cliente/profile'),
        headers: {
          ...ApiConfig.defaultHeaders,
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);
      if (response.statusCode == 200 && data['success']) {
        return data['data'];
      } else {
        throw Exception(data['message'] ?? 'Error al obtener el perfil');
      }
    } catch (e) {
      throw Exception('Error de conexión: $e');
    }
  }

  // Update client profile
  Future<Map<String, dynamic>> updateProfile(Map<String, dynamic> profileData) async {
    final token = await _authService.getToken();
    if (token == null) throw Exception('No auth token found');

    try {
      final response = await http.put(
        Uri.parse('${ApiConfig.baseUrl}/api/cliente/profile'),
        headers: {
          ...ApiConfig.defaultHeaders,
          'Authorization': 'Bearer $token',
        },
        body: json.encode({'profileData': profileData}),
      );

      final data = json.decode(response.body);
      if (response.statusCode == 200 && data['success']) {
        return data['data'];
      } else {
        throw Exception(data['message'] ?? 'Error al actualizar el perfil');
      }
    } catch (e) {
      throw Exception('Error de conexión: $e');
    }
  }
}
```

### Loyalty Cards Service

Create `lib/services/cards_service.dart`:

```dart
class CardsService {
  final AuthService _authService = AuthService();

  // Get client's loyalty cards
  Future<List<dynamic>> getCards() async {
    final token = await _authService.getToken();
    if (token == null) throw Exception('No auth token found');

    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/api/cliente/cards'),
        headers: {
          ...ApiConfig.defaultHeaders,
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);
      if (response.statusCode == 200 && data['success']) {
        return data['data']['tarjetas'];
      } else {
        throw Exception(data['message'] ?? 'Error al obtener las tarjetas');
      }
    } catch (e) {
      throw Exception('Error de conexión: $e');
    }
  }
}
```

## Models

Create models to handle the data structures:

### Client Model

Create `lib/models/client.dart`:

```dart
class Client {
  final String id;
  final PersonalData datosPersonales;
  final List<String> categoriaFavorita;
  final Engagement engagement;

  Client({
    required this.id,
    required this.datosPersonales,
    required this.categoriaFavorita,
    required this.engagement,
  });

  factory Client.fromJson(Map<String, dynamic> json) {
    return Client(
      id: json['_id'],
      datosPersonales: PersonalData.fromJson(json['datosPersonales']),
      categoriaFavorita: List<String>.from(json['categoriaFavorita']),
      engagement: Engagement.fromJson(json['engagement']),
    );
  }
}

class PersonalData {
  final String nombre;
  final int edad;
  final String genero;
  final String? fotoPerfil;
  final Location ubicacion;

  PersonalData({
    required this.nombre,
    required this.edad,
    required this.genero,
    this.fotoPerfil,
    required this.ubicacion,
  });

  factory PersonalData.fromJson(Map<String, dynamic> json) {
    return PersonalData(
      nombre: json['nombre'],
      edad: json['edad'],
      genero: json['genero'],
      fotoPerfil: json['fotoPerfil'],
      ubicacion: Location.fromJson(json['ubicacion']),
    );
  }
}
```

### Card Model

Create `lib/models/loyalty_card.dart`:

```dart
class LoyaltyCard {
  final String negocioId;
  final int nivel;
  final int visitas;
  final DateTime ultimaVisita;

  LoyaltyCard({
    required this.negocioId,
    required this.nivel,
    required this.visitas,
    required this.ultimaVisita,
  });

  factory LoyaltyCard.fromJson(Map<String, dynamic> json) {
    return LoyaltyCard(
      negocioId: json['negocio_id'],
      nivel: json['nivel'],
      visitas: json['visitas'],
      ultimaVisita: DateTime.parse(json['ultimaVisita']),
    );
  }
}
```

## Usage Examples

### Login Screen

```dart
class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final AuthService _authService = AuthService();
  final _formKey = GlobalKey<FormState>();
  String _email = '';
  String _password = '';
  bool _isLoading = false;

  Future<void> _login() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final result = await _authService.login(_email, _password);
      // Navigate to home screen on success
      Navigator.of(context).pushReplacementNamed('/home');
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString())),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    // Implement your login UI here
  }
}
```

### Profile Screen

```dart
class ProfileScreen extends StatefulWidget {
  @override
  _ProfileScreenState createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final ClientService _clientService = ClientService();
  Map<String, dynamic>? _profileData;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    try {
      final profile = await _clientService.getProfile();
      setState(() {
        _profileData = profile;
        _isLoading = false;
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString())),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    // Implement your profile UI here using _profileData
  }
}
```

## Important Notes

1. **Dependencies**
   Add these dependencies to your `pubspec.yaml`:

```yaml
dependencies:
  http: ^1.1.0
  flutter_secure_storage: ^9.0.0
  json_annotation: ^4.8.1
```

2. **Error Handling**

- Always handle network errors appropriately
- Show loading states during API calls
- Implement proper error messages for users

3. **Security**

- Store the JWT token securely using `flutter_secure_storage`
- Never store sensitive information in plain text
- Always use HTTPS in production

4. **Testing**

- Test API integration with both development and production endpoints
- Implement proper error handling for all API calls
- Test token expiration and refresh scenarios

## API Endpoints Reference

### Authentication

- POST `/api/auth/login`
  - Body: `{ email: string, contrasena: string }`
  - Response: `{ success: boolean, token: string, user: Object }`

### Client Profile

- GET `/api/cliente/profile`

  - Headers: `Authorization: Bearer <token>`
  - Response: `{ success: boolean, data: { datosPersonales: Object, categoriaFavorita: Array, engagement: Object } }`

- PUT `/api/cliente/profile`
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ profileData: Object }`
  - Response: `{ success: boolean, data: Object }`

### Loyalty Cards

- GET `/api/cliente/cards`
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ success: boolean, data: { tarjetas: Array } }`

## Support

For any integration issues or questions, please contact:

- Backend team: [Contact Information]
- API Documentation: [Documentation URL]

---

# Guía de Integración Móvil de Tarjeto

## Descripción General

Este documento explica cómo integrar la aplicación móvil Flutter con la API backend de Tarjeto. El backend utiliza autenticación basada en JWT y proporciona endpoints para la gestión de perfiles de clientes y tarjetas de fidelización.

## Configuración Base

### Configuración de la API

Crea un archivo de configuración `lib/config/api_config.dart`:

```dart
class ApiConfig {
  static const String baseUrl = 'http://your-api-url';  // Desarrollo
  // static const String baseUrl = 'https://api.tarjeto.app';  // Producción

  static const Map<String, String> defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
}
```

### Servicio de Autenticación

Crea un servicio de autenticación `lib/services/auth_service.dart`:

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthService {
  final storage = const FlutterSecureStorage();

  // Inicio de sesión
  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/api/auth/login'),
        headers: ApiConfig.defaultHeaders,
        body: json.encode({
          'email': email,
          'contrasena': password,
        }),
      );

      final data = json.decode(response.body);

      if (response.statusCode == 200 && data['success']) {
        // Almacenar el token de forma segura
        await storage.write(key: 'auth_token', value: data['token']);
        return data;
      } else {
        throw Exception(data['message'] ?? 'Error en el inicio de sesión');
      }
    } catch (e) {
      throw Exception('Error de conexión: $e');
    }
  }

  // Obtener token almacenado
  Future<String?> getToken() async {
    return await storage.read(key: 'auth_token');
  }

  // Cerrar sesión
  Future<void> logout() async {
    await storage.delete(key: 'auth_token');
  }
}
```

## Servicios de la API

### Servicio de Perfil del Cliente

Crea `lib/services/client_service.dart`:

```dart
class ClientService {
  final AuthService _authService = AuthService();

  // Obtener perfil del cliente
  Future<Map<String, dynamic>> getProfile() async {
    final token = await _authService.getToken();
    if (token == null) throw Exception('No se encontró el token de autenticación');

    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/api/cliente/profile'),
        headers: {
          ...ApiConfig.defaultHeaders,
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);
      if (response.statusCode == 200 && data['success']) {
        return data['data'];
      } else {
        throw Exception(data['message'] ?? 'Error al obtener el perfil');
      }
    } catch (e) {
      throw Exception('Error de conexión: $e');
    }
  }

  // Actualizar perfil del cliente
  Future<Map<String, dynamic>> updateProfile(Map<String, dynamic> profileData) async {
    final token = await _authService.getToken();
    if (token == null) throw Exception('No se encontró el token de autenticación');

    try {
      final response = await http.put(
        Uri.parse('${ApiConfig.baseUrl}/api/cliente/profile'),
        headers: {
          ...ApiConfig.defaultHeaders,
          'Authorization': 'Bearer $token',
        },
        body: json.encode({'profileData': profileData}),
      );

      final data = json.decode(response.body);
      if (response.statusCode == 200 && data['success']) {
        return data['data'];
      } else {
        throw Exception(data['message'] ?? 'Error al actualizar el perfil');
      }
    } catch (e) {
      throw Exception('Error de conexión: $e');
    }
  }
}
```

### Servicio de Tarjetas de Fidelización

Crea `lib/services/cards_service.dart`:

```dart
class CardsService {
  final AuthService _authService = AuthService();

  // Obtener tarjetas del cliente
  Future<List<dynamic>> getCards() async {
    final token = await _authService.getToken();
    if (token == null) throw Exception('No se encontró el token de autenticación');

    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/api/cliente/cards'),
        headers: {
          ...ApiConfig.defaultHeaders,
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);
      if (response.statusCode == 200 && data['success']) {
        return data['data']['tarjetas'];
      } else {
        throw Exception(data['message'] ?? 'Error al obtener las tarjetas');
      }
    } catch (e) {
      throw Exception('Error de conexión: $e');
    }
  }
}
```

## Modelos

Crea modelos para manejar las estructuras de datos:

### Modelo de Cliente

Crea `lib/models/client.dart`:

```dart
class Client {
  final String id;
  final PersonalData datosPersonales;
  final List<String> categoriaFavorita;
  final Engagement engagement;

  Client({
    required this.id,
    required this.datosPersonales,
    required this.categoriaFavorita,
    required this.engagement,
  });

  factory Client.fromJson(Map<String, dynamic> json) {
    return Client(
      id: json['_id'],
      datosPersonales: PersonalData.fromJson(json['datosPersonales']),
      categoriaFavorita: List<String>.from(json['categoriaFavorita']),
      engagement: Engagement.fromJson(json['engagement']),
    );
  }
}

class PersonalData {
  final String nombre;
  final int edad;
  final String genero;
  final String? fotoPerfil;
  final Location ubicacion;

  PersonalData({
    required this.nombre,
    required this.edad,
    required this.genero,
    this.fotoPerfil,
    required this.ubicacion,
  });

  factory PersonalData.fromJson(Map<String, dynamic> json) {
    return PersonalData(
      nombre: json['nombre'],
      edad: json['edad'],
      genero: json['genero'],
      fotoPerfil: json['fotoPerfil'],
      ubicacion: Location.fromJson(json['ubicacion']),
    );
  }
}
```

### Modelo de Tarjeta

Crea `lib/models/loyalty_card.dart`:

```dart
class LoyaltyCard {
  final String negocioId;
  final int nivel;
  final int visitas;
  final DateTime ultimaVisita;

  LoyaltyCard({
    required this.negocioId,
    required this.nivel,
    required this.visitas,
    required this.ultimaVisita,
  });

  factory LoyaltyCard.fromJson(Map<String, dynamic> json) {
    return LoyaltyCard(
      negocioId: json['negocio_id'],
      nivel: json['nivel'],
      visitas: json['visitas'],
      ultimaVisita: DateTime.parse(json['ultimaVisita']),
    );
  }
}
```

## Ejemplos de Uso

### Pantalla de Inicio de Sesión

```dart
class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final AuthService _authService = AuthService();
  final _formKey = GlobalKey<FormState>();
  String _email = '';
  String _password = '';
  bool _isLoading = false;

  Future<void> _login() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final result = await _authService.login(_email, _password);
      // Navegar a la pantalla principal después del éxito
      Navigator.of(context).pushReplacementNamed('/home');
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString())),
      );
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    // Implementa tu UI de login aquí
  }
}
```

### Pantalla de Perfil

```dart
class ProfileScreen extends StatefulWidget {
  @override
  _ProfileScreenState createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final ClientService _clientService = ClientService();
  Map<String, dynamic>? _profileData;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    try {
      final profile = await _clientService.getProfile();
      setState(() {
        _profileData = profile;
        _isLoading = false;
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString())),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    // Implementa tu UI de perfil aquí usando _profileData
  }
}
```

## Notas Importantes

1. **Dependencias**
   Agrega estas dependencias a tu `pubspec.yaml`:

```yaml
dependencies:
  http: ^1.1.0
  flutter_secure_storage: ^9.0.0
  json_annotation: ^4.8.1
```

2. **Manejo de Errores**

- Maneja siempre los errores de red apropiadamente
- Muestra estados de carga durante las llamadas a la API
- Implementa mensajes de error apropiados para los usuarios

3. **Seguridad**

- Almacena el token JWT de forma segura usando `flutter_secure_storage`
- Nunca almacenes información sensible en texto plano
- Siempre usa HTTPS en producción

4. **Pruebas**

- Prueba la integración de la API tanto en desarrollo como en producción
- Implementa manejo de errores adecuado para todas las llamadas a la API
- Prueba escenarios de expiración y renovación de tokens

## Referencia de Endpoints de la API

### Autenticación

- POST `/api/auth/login`
  - Cuerpo: `{ email: string, contrasena: string }`
  - Respuesta: `{ success: boolean, token: string, user: Object }`

### Perfil del Cliente

- GET `/api/cliente/profile`

  - Encabezados: `Authorization: Bearer <token>`
  - Respuesta: `{ success: boolean, data: { datosPersonales: Object, categoriaFavorita: Array, engagement: Object } }`

- PUT `/api/cliente/profile`
  - Encabezados: `Authorization: Bearer <token>`
  - Cuerpo: `{ profileData: Object }`
  - Respuesta: `{ success: boolean, data: Object }`

### Tarjetas de Fidelización

- GET `/api/cliente/cards`
  - Encabezados: `Authorization: Bearer <token>`
  - Respuesta: `{ success: boolean, data: { tarjetas: Array } }`

## Soporte

Para cualquier problema de integración o preguntas, contacta a:

- Equipo de Backend: [Información de Contacto]
- Documentación de la API: [URL de la Documentación]
