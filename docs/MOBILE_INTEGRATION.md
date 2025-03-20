# Guía de Integración Móvil de Tarjeto (Actualizada)

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
    'Cliente': 'flutter-app', // Importante: identifica al cliente como móvil
  };
}
```

### Servicio de Autenticación

Crea un servicio de autenticación `lib/services/auth_service.dart`:

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../config/api_config.dart';

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
        await storage.write(key: 'user_id', value: data['user']['_id']);
        return data;
      } else {
        throw Exception(data['message'] ?? 'Error en el inicio de sesión');
      }
    } catch (e) {
      throw Exception('Error de conexión: $e');
    }
  }

  // Registro de usuario
  Future<Map<String, dynamic>> signup(String email, String password, String nombre) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/api/auth/signup'),
        headers: ApiConfig.defaultHeaders,
        body: json.encode({
          'email': email,
          'contrasena': password,
          'nombre': nombre,
        }),
      );

      final data = json.decode(response.body);

      if (response.statusCode == 201 && data['success']) {
        return data;
      } else {
        throw Exception(data['message'] ?? 'Error en el registro');
      }
    } catch (e) {
      throw Exception('Error de conexión: $e');
    }
  }

  // Verificar email con código
  Future<Map<String, dynamic>> verifyEmail(String code) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/api/auth/verify-email'),
        headers: ApiConfig.defaultHeaders,
        body: json.encode({
          'code': code,
        }),
      );

      final data = json.decode(response.body);

      if (response.statusCode == 200 && data['success']) {
        // Almacenar el token y datos del usuario
        await storage.write(key: 'auth_token', value: data['token']);
        await storage.write(key: 'user_id', value: data['user']['_id']);
        return data;
      } else {
        throw Exception(data['message'] ?? 'Error en la verificación');
      }
    } catch (e) {
      throw Exception('Error de conexión: $e');
    }
  }

  // Recuperación de contraseña
  Future<Map<String, dynamic>> forgotPassword(String email) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/api/auth/forgot-password'),
        headers: ApiConfig.defaultHeaders,
        body: json.encode({
          'email': email,
        }),
      );

      final data = json.decode(response.body);

      if (response.statusCode == 200 && data['success']) {
        return data;
      } else {
        throw Exception(data['message'] ?? 'Error en la recuperación de contraseña');
      }
    } catch (e) {
      throw Exception('Error de conexión: $e');
    }
  }

  // Restablecer contraseña
  Future<Map<String, dynamic>> resetPassword(String token, String password) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/api/auth/reset-password/${token}'),
        headers: ApiConfig.defaultHeaders,
        body: json.encode({
          'contrasena': password,
        }),
      );

      final data = json.decode(response.body);

      if (response.statusCode == 200 && data['success']) {
        return data;
      } else {
        throw Exception(data['message'] ?? 'Error al restablecer la contraseña');
      }
    } catch (e) {
      throw Exception('Error de conexión: $e');
    }
  }

  // Verificar autenticación
  Future<Map<String, dynamic>> checkAuth() async {
    final token = await getToken();
    if (token == null) throw Exception('No se encontró el token de autenticación');

    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/api/auth/check'),
        headers: {
          ...ApiConfig.defaultHeaders,
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);
      if (response.statusCode == 200 && data['success']) {
        return data;
      } else {
        throw Exception(data['message'] ?? 'Error al verificar autenticación');
      }
    } catch (e) {
      throw Exception('Error de conexión: $e');
    }
  }

  // Configurar perfil
  Future<Map<String, dynamic>> setupProfile(String userType, Map<String, dynamic> profileData, [File? profileImage]) async {
    final token = await getToken();
    if (token == null) throw Exception('No se encontró el token de autenticación');

    try {
      // Crear un request multipart para manejar la imagen
      var request = http.MultipartRequest(
        'POST',
        Uri.parse('${ApiConfig.baseUrl}/api/auth/setup-profile'),
      );

      // Añadir headers
      request.headers.addAll({
        ...ApiConfig.defaultHeaders,
        'Authorization': 'Bearer $token',
      });

      // Añadir campos de texto
      request.fields['userType'] = userType;
      request.fields['profileData'] = json.encode(profileData);

      // Añadir imagen si existe
      if (profileImage != null) {
        request.files.add(await http.MultipartFile.fromPath(
          'profileImage',
          profileImage.path,
        ));
      }

      // Enviar la solicitud
      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);

      final data = json.decode(response.body);
      if (response.statusCode == 200 && data['success']) {
        return data;
      } else {
        throw Exception(data['message'] ?? 'Error al configurar el perfil');
      }
    } catch (e) {
      throw Exception('Error de conexión: $e');
    }
  }

  // Obtener token almacenado
  Future<String?> getToken() async {
    return await storage.read(key: 'auth_token');
  }

  // Obtener ID de usuario almacenado
  Future<String?> getUserId() async {
    return await storage.read(key: 'user_id');
  }

  // Cerrar sesión
  Future<void> logout() async {
    await storage.delete(key: 'auth_token');
    await storage.delete(key: 'user_id');
  }
}
```

## Servicios de la API

### Servicio de Perfil del Cliente

Crea `lib/services/client_service.dart`:

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';
import '../services/auth_service.dart';

class ClientService {
  final AuthService _authService = AuthService();

  // Obtener perfil del cliente
  Future<Map<String, dynamic>> getProfile() async {
    final token = await _authService.getToken();
    final userId = await _authService.getUserId();

    if (token == null) throw Exception('No se encontró el token de autenticación');
    if (userId == null) throw Exception('No se encontró el ID de usuario');

    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/api/cliente/profile/${userId}'),
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
    final userId = await _authService.getUserId();

    if (token == null) throw Exception('No se encontró el token de autenticación');
    if (userId == null) throw Exception('No se encontró el ID de usuario');

    try {
      final response = await http.put(
        Uri.parse('${ApiConfig.baseUrl}/api/cliente/profile/${userId}'),
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
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';
import '../services/auth_service.dart';

class CardsService {
  final AuthService _authService = AuthService();

  // Obtener tarjetas del cliente
  Future<List<dynamic>> getCards() async {
    final token = await _authService.getToken();
    final userId = await _authService.getUserId();

    if (token == null) throw Exception('No se encontró el token de autenticación');
    if (userId == null) throw Exception('No se encontró el ID de usuario');

    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/api/cliente/tarjetas/${userId}'),
        headers: {
          ...ApiConfig.defaultHeaders,
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);
      if (response.statusCode == 200 && data['success']) {
        return data['data'];
      } else if (response.statusCode == 404 && data['data']?.containsKey('tarjetas')) {
        // Si el cliente no tiene tarjetas, se devuelve un array vacío
        return [];
      } else {
        throw Exception(data['message'] ?? 'Error al obtener las tarjetas');
      }
    } catch (e) {
      throw Exception('Error de conexión: $e');
    }
  }

  // Obtener otros negocios (sin tarjeta)
  Future<List<dynamic>> getOtherBusinesses() async {
    final token = await _authService.getToken();
    final userId = await _authService.getUserId();

    if (token == null) throw Exception('No se encontró el token de autenticación');
    if (userId == null) throw Exception('No se encontró el ID de usuario');

    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/api/cliente/otrosNegocios/${userId}'),
        headers: {
          ...ApiConfig.defaultHeaders,
          'Authorization': 'Bearer $token',
        },
      );

      final data = json.decode(response.body);
      if (response.statusCode == 200 && data['success']) {
        return data['data'];
      } else {
        throw Exception(data['message'] ?? 'Error al obtener otros negocios');
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
  final String publicID;
  final String usuarioID;
  final PersonalData datosPersonales;
  final List<String> categoriaFavorita;

  Client({
    required this.id,
    required this.publicID,
    required this.usuarioID,
    required this.datosPersonales,
    required this.categoriaFavorita,
  });

  factory Client.fromJson(Map<String, dynamic> json) {
    return Client(
      id: json['_id'],
      publicID: json['publicID'],
      usuarioID: json['usuarioID'],
      datosPersonales: PersonalData.fromJson(json['datosPersonales']),
      categoriaFavorita: List<String>.from(json['categoriaFavorita']),
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

class Location {
  final String ciudad;
  final String codigoPostal;

  Location({
    required this.ciudad,
    required this.codigoPostal,
  });

  factory Location.fromJson(Map<String, dynamic> json) {
    return Location(
      ciudad: json['ciudad'],
      codigoPostal: json['codigoPostal'],
    );
  }
}
```

### Modelo de Negocio

Crea `lib/models/business.dart`:

```dart
class Business {
  final String publicID;
  final String nombreComercial;
  final String? fotoPerfil;
  final String categoria;
  final String color;
  final Map<String, dynamic>? gradient;
  final SocialMedia redesSociales;

  Business({
    required this.publicID,
    required this.nombreComercial,
    this.fotoPerfil,
    required this.categoria,
    required this.color,
    this.gradient,
    required this.redesSociales,
  });

  factory Business.fromJson(Map<String, dynamic> json) {
    return Business(
      publicID: json['publicID'],
      nombreComercial: json['nombreComercial'],
      fotoPerfil: json['fotoPerfil'],
      categoria: json['categoria'],
      color: json['color'],
      gradient: json['gradient'],
      redesSociales: SocialMedia.fromJson(json['redesSociales']),
    );
  }
}

class SocialMedia {
  final String? facebook;
  final String? instagram;
  final String? tiktok;

  SocialMedia({
    this.facebook,
    this.instagram,
    this.tiktok,
  });

  factory SocialMedia.fromJson(Map<String, dynamic> json) {
    return SocialMedia(
      facebook: json['facebook'],
      instagram: json['instagram'],
      tiktok: json['tiktok'],
    );
  }
}
```

## Referencia de Endpoints de la API

### Autenticación

| Endpoint                          | Método | Descripción             | Parámetros                                           | Respuesta                                                                  |
| --------------------------------- | ------ | ----------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------- |
| `/api/auth/login`                 | POST   | Iniciar sesión          | `email`, `contrasena`                                | `{ success: boolean, token: string, user: Object }`                        |
| `/api/auth/signup`                | POST   | Registrar usuario       | `email`, `contrasena`, `nombre`                      | `{ success: boolean, message: string, user: Object }`                      |
| `/api/auth/verify-email`          | POST   | Verificar email         | `code`                                               | `{ success: boolean, token: string, user: Object }`                        |
| `/api/auth/forgot-password`       | POST   | Solicitar recuperación  | `email`                                              | `{ success: boolean, message: string }`                                    |
| `/api/auth/reset-password/:token` | POST   | Restablecer contraseña  | `contrasena`                                         | `{ success: boolean, message: string }`                                    |
| `/api/auth/check`                 | GET    | Verificar autenticación | Token JWT                                            | `{ success: boolean, usuario: Object, profile: Object, userType: string }` |
| `/api/auth/setup-profile`         | POST   | Configurar perfil       | `userType`, `profileData`, `profileImage` (opcional) | `{ success: boolean, message: string, userType: string }`                  |

### Perfil del Cliente

| Endpoint                       | Método | Descripción       | Parámetros               | Respuesta                            |
| ------------------------------ | ------ | ----------------- | ------------------------ | ------------------------------------ |
| `/api/cliente/profile/:userId` | GET    | Obtener perfil    | Token JWT                | `{ success: boolean, data: Object }` |
| `/api/cliente/profile/:userId` | PUT    | Actualizar perfil | Token JWT, `profileData` | `{ success: boolean, data: Object }` |

### Tarjetas de Fidelización

| Endpoint                             | Método | Descripción                  | Parámetros | Respuesta                           |
| ------------------------------------ | ------ | ---------------------------- | ---------- | ----------------------------------- |
| `/api/cliente/tarjetas/:userId`      | GET    | Obtener tarjetas             | Token JWT  | `{ success: boolean, data: Array }` |
| `/api/cliente/otrosNegocios/:userId` | GET    | Obtener negocios sin tarjeta | Token JWT  | `{ success: boolean, data: Array }` |

## Detalles de Respuestas

### Respuesta de Login

```json
{
  "success": true,
  "message": "Login exitoso",
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "email": "usuario@ejemplo.com",
    "nombre": "Usuario Ejemplo",
    "tipoUsuario": "Cliente",
    "verificado": true,
    "ultimaConexion": "2025-03-20T15:30:45.123Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Respuesta de Perfil

```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c86",
    "usuarioID": "60d21b4667d0d8992e610c85",
    "publicID": "CLI1A2B3C4D",
    "datosPersonales": {
      "nombre": "Usuario Ejemplo",
      "edad": 30,
      "genero": "masculino",
      "fotoPerfil": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...",
      "ubicacion": {
        "ciudad": "Ciudad Ejemplo",
        "codigoPostal": "12345"
      }
    },
    "categoriaFavorita": ["café", "restaurante", "bar"]
  }
}
```

### Respuesta de Tarjetas

```json
{
  "success": true,
  "message": "Tarjetas del cliente",
  "data": [
    {
      "publicID": "NEG1A2B3C4D",
      "nombreComercial": "Café Ejemplo",
      "fotoPerfil": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...",
      "categoria": "café",
      "color": "#EF4444",
      "gradient": {
        "colors": ["#FF5F6D", "#FFC371"],
        "stops": [0.0, 1.0]
      },
      "redesSociales": {
        "facebook": "cafeejemplo",
        "instagram": "cafe_ejemplo",
        "tiktok": "cafeejemplo"
      }
    }
  ]
}
```

### Respuesta de Otros Negocios

```json
{
  "success": true,
  "message": "Negocios que el usuario no tiene tarjeta",
  "data": [
    {
      "publicID": "NEG5E6F7G8H",
      "nombreComercial": "Restaurante Ejemplo",
      "fotoPerfil": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...",
      "categoria": "restaurante",
      "color": "#10B981",
      "redesSociales": {
        "facebook": "restauranteejemplo",
        "instagram": "restaurante_ejemplo",
        "tiktok": ""
      }
    }
  ]
}
```

## Notas Importantes

1. **Encabezados Requeridos**

   - Todos los endpoints requieren el encabezado `Cliente: flutter-app` para identificar solicitudes móviles
   - Las solicitudes autenticadas requieren el encabezado `Authorization: Bearer <token>`

2. **Manejo de Errores**

   - Todas las respuestas de error incluyen `success: false` y un mensaje descriptivo
   - Códigos de estado HTTP comunes:
     - `200`: Éxito
     - `201`: Creación exitosa
     - `400`: Error de solicitud
     - `401`: No autorizado
     - `404`: Recurso no encontrado
     - `500`: Error del servidor

3. **Parámetros en Ruta**

   - Los endpoints que contienen `:userId` requieren el ID del usuario en la ruta
   - Este ID se puede obtener de la respuesta de login o del almacenamiento seguro

4. **Seguridad**

   - Almacena el token JWT de forma segura usando `flutter_secure_storage`
   - Nunca almacenes información sensible en texto plano
   - Siempre usa HTTPS en producción

5. **Formato de Imágenes**
   - Las imágenes se devuelven y se envían como cadenas base64 con formato `data:<mimetype>;base64,<data>`
   - Para enviar imágenes, usa solicitudes multipart

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

### Pantalla de Tarjetas

```dart
class CardsScreen extends StatefulWidget {
  @override
  _CardsScreenState createState() => _CardsScreenState();
}

class _CardsScreenState extends State<CardsScreen> {
  final CardsService _cardsService = CardsService();
  List<dynamic>? _cards;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadCards();
  }

  Future<void> _loadCards() async {
    try {
      final cards = await _cardsService.getCards();
      setState(() {
        _cards = cards;
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
    // Implementa tu UI de tarjetas aquí usando _cards
  }
}
```

## Dependencias

Agrega estas dependencias a tu `pubspec.yaml`:

```yaml
dependencies:
  http: ^1.1.0
  flutter_secure_storage: ^9.0.0
  json_annotation: ^4.8.1
  image_picker: ^1.0.4
  path: ^1.8.3
```
